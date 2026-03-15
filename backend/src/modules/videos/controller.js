const pool = require('../../config/db');
const { enrichVideosWithLockStatus } = require('../../utils/ordering');

exports.getVideoById = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const userId = req.user.id;

    // Get the video to find its subject
    const [videoRows] = await pool.query(`
      SELECT v.*, s.subject_id 
      FROM videos v
      JOIN sections s ON v.section_id = s.id
      WHERE v.id = ?
    `, [videoId]);

    if (videoRows.length === 0) {
      return res.status(404).json({ error: { message: 'Video not found' } });
    }

    const subjectId = videoRows[0].subject_id;

    // Get all videos for the subject
    const [allVideos] = await pool.query(`
      SELECT v.* 
      FROM videos v
      JOIN sections s ON v.section_id = s.id
      WHERE s.subject_id = ?
      ORDER BY s.order_index ASC, v.order_index ASC
    `, [subjectId]);

    // Get user progress
    const videoIds = allVideos.map(v => v.id);
    let progressList = [];
    if (videoIds.length > 0) {
      const placeholders = videoIds.map(() => '?').join(',');
      const [progressRecords] = await pool.query(`
        SELECT * FROM progress 
        WHERE user_id = ? AND video_id IN (${placeholders})
      `, [userId, ...videoIds]);
      progressList = progressRecords;
    }

    // Enrich
    const enrichedVideos = enrichVideosWithLockStatus(allVideos, progressList);

    const targetVideo = enrichedVideos.find(v => v.id === parseInt(videoId));

    res.json(targetVideo);
  } catch (error) {
    next(error);
  }
};

exports.getFirstVideo = async (req, res, next) => {
  try {
    const { subjectId } = req.params;
    const userId = req.user.id;

    const [allVideos] = await pool.query(`
      SELECT v.* 
      FROM videos v
      JOIN sections s ON v.section_id = s.id
      WHERE s.subject_id = ?
      ORDER BY s.order_index ASC, v.order_index ASC
    `, [subjectId]);

    if (allVideos.length === 0) {
      return res.status(404).json({ error: { message: 'No videos found for this subject' } });
    }

    // Get user progress for the first video specifically or all
    const videoIds = allVideos.map(v => v.id);
    const placeholders = videoIds.map(() => '?').join(',');
    const [progressRecords] = await pool.query(`
      SELECT * FROM progress 
      WHERE user_id = ? AND video_id IN (${placeholders})
    `, [userId, ...videoIds]);

    const enrichedVideos = enrichVideosWithLockStatus(allVideos, progressRecords);

    res.json(enrichedVideos[0]);
  } catch (error) {
    next(error);
  }
};
