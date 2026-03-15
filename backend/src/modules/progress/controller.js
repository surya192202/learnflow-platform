const pool = require('../../config/db');
const { canUnlockVideo } = require('../../utils/ordering');

exports.getSubjectProgress = async (req, res, next) => {
  try {
    const { subjectId } = req.params;
    const userId = req.user.id;

    const [records] = await pool.query(`
      SELECT p.* 
      FROM progress p
      JOIN videos v ON p.video_id = v.id
      JOIN sections s ON v.section_id = s.id
      WHERE s.subject_id = ? AND p.user_id = ?
    `, [subjectId, userId]);

    res.json(records);
  } catch (error) {
    next(error);
  }
};

exports.getVideoProgress = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const userId = req.user.id;

    const [records] = await pool.query(`
      SELECT * FROM progress 
      WHERE user_id = ? AND video_id = ?
    `, [userId, videoId]);

    if (records.length === 0) {
      return res.json({ last_position_seconds: 0, is_completed: false, completed_at: null });
    }

    res.json(records[0]);
  } catch (error) {
    next(error);
  }
};

exports.updateVideoProgress = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const userId = req.user.id;
    let { last_position_seconds, is_completed } = req.body;

    // 1. Check if video exists and get duration
    const [videos] = await pool.query('SELECT duration_seconds FROM videos WHERE id = ?', [videoId]);
    if (videos.length === 0) {
      return res.status(404).json({ error: { message: 'Video not found' } });
    }
    const duration = videos[0].duration_seconds;

    // 2. Check if locked
    const unlocked = await canUnlockVideo(pool, userId, videoId);
    if (!unlocked) {
      return res.status(403).json({ error: { message: 'Video is locked based on sequence' } });
    }

    // 3. Cap position
    if (last_position_seconds > duration) {
      last_position_seconds = duration;
    }

    // 4. Force complete if position is practically at end, or use body's explicit complete
    is_completed = Boolean(is_completed);
    if (last_position_seconds >= duration) {
      is_completed = true;
    }

    // 5. Upsert progress
    const [existing] = await pool.query('SELECT id, is_completed FROM progress WHERE user_id = ? AND video_id = ?', [userId, videoId]);
    
    // If previously completed, don't un-complete it
    if (existing.length > 0 && existing[0].is_completed) {
      is_completed = true;
    }

    let completed_at = is_completed ? new Date() : null;

    if (existing.length > 0) {
      const prevCompletedAt = existing[0].completed_at;
      if (is_completed && !existing[0].is_completed) {
        completed_at = new Date(); // newly completed
      } else if (existing[0].is_completed) {
        completed_at = prevCompletedAt; // keep existing completion time
      }

      await pool.query(`
        UPDATE progress 
        SET last_position_seconds = ?, is_completed = ?, completed_at = ?
        WHERE id = ?
      `, [last_position_seconds, is_completed, completed_at, existing[0].id]);
    } else {
      await pool.query(`
        INSERT INTO progress (user_id, video_id, last_position_seconds, is_completed, completed_at)
        VALUES (?, ?, ?, ?, ?)
      `, [userId, videoId, last_position_seconds, is_completed, completed_at]);
    }

    res.json({ success: true, last_position_seconds, is_completed });
  } catch (error) {
    next(error);
  }
};
