const pool = require('../../config/db');
const { enrichVideosWithLockStatus } = require('../../utils/ordering');

exports.getAllSubjects = async (req, res, next) => {
  try {
    const [subjects] = await pool.query('SELECT * FROM subjects WHERE is_published = 1 ORDER BY created_at DESC');
    res.json(subjects);
  } catch (error) {
    next(error);
  }
};

exports.getSubjectById = async (req, res, next) => {
  try {
    const { subjectId } = req.params;
    const [subjects] = await pool.query('SELECT * FROM subjects WHERE id = ?', [subjectId]);
    
    if (subjects.length === 0) {
      return res.status(404).json({ error: { message: 'Subject not found' } });
    }
    res.json(subjects[0]);
  } catch (error) {
    next(error);
  }
};

exports.getSubjectTree = async (req, res, next) => {
  try {
    const { subjectId } = req.params;
    const userId = req.user.id;

    // 1. Get Subject
    const [subjects] = await pool.query('SELECT * FROM subjects WHERE id = ?', [subjectId]);
    if (subjects.length === 0) {
      return res.status(404).json({ error: { message: 'Subject not found' } });
    }
    const subject = subjects[0];

    // 2. Get Sections
    const [sections] = await pool.query(
      'SELECT * FROM sections WHERE subject_id = ? ORDER BY order_index ASC',
      [subjectId]
    );

    // 3. Get all videos for this subject ordered correctly
    const [videos] = await pool.query(`
      SELECT v.* 
      FROM videos v
      JOIN sections s ON v.section_id = s.id
      WHERE s.subject_id = ?
      ORDER BY s.order_index ASC, v.order_index ASC
    `, [subjectId]);

    // 4. Get User Progress for these videos
    const videoIds = videos.map(v => v.id);
    let progressList = [];
    if (videoIds.length > 0) {
      const placeholders = videoIds.map(() => '?').join(',');
      const [progressRecords] = await pool.query(`
        SELECT * FROM progress 
        WHERE user_id = ? AND video_id IN (${placeholders})
      `, [userId, ...videoIds]);
      progressList = progressRecords;
    }

    // 5. Enrich videos with lock status and progress
    const enrichedVideos = enrichVideosWithLockStatus(videos, progressList);

    // 6. Group videos by section
    const sectionsWithVideos = sections.map(section => {
      return {
        ...section,
        videos: enrichedVideos.filter(v => v.section_id === section.id)
      };
    });

    res.json({
      ...subject,
      sections: sectionsWithVideos
    });
  } catch (error) {
    next(error);
  }
};
