/**
 * Calculates the lock status and previous/next videos in a sequence.
 * @param {Array} videos - Array of all videos in a subject, ordered by section.order_index, then video.order_index
 * @param {Array} progressList - Array of progress records for a given user in this subject
 * @returns {Array} - Enriched array of videos with locked, previous_video_id, next_video_id, and unlock_reason properties
 */
function enrichVideosWithLockStatus(videos, progressList) {
  const progressMap = new Map();
  progressList.forEach(p => {
    progressMap.set(p.video_id, p);
  });

  return videos.map((video, index) => {
    const prevVideo = index > 0 ? videos[index - 1] : null;
    const nextVideo = index < videos.length - 1 ? videos[index + 1] : null;

    let locked = false;
    let unlockReason = null;

    if (prevVideo) {
      const prevProgress = progressMap.get(prevVideo.id);
      if (!prevProgress || !prevProgress.is_completed) {
        locked = true;
        unlockReason = `Complete "${prevVideo.title}" to unlock this video.`;
      }
    }

    const currentProgress = progressMap.get(video.id);

    return {
      ...video,
      previous_video_id: prevVideo ? prevVideo.id : null,
      next_video_id: nextVideo ? nextVideo.id : null,
      locked,
      unlock_reason: locked ? unlockReason : null,
      progress: currentProgress ? {
        last_position_seconds: currentProgress.last_position_seconds,
        is_completed: Boolean(currentProgress.is_completed),
        completed_at: currentProgress.completed_at
      } : {
        last_position_seconds: 0,
        is_completed: false,
        completed_at: null
      }
    };
  });
}

/**
 * Validates whether a user can unlock a given video.
 * Calculates order index and ensures previous is true.
 */
async function canUnlockVideo(pool, userId, videoId) {
  // get the video details (section_id, order_index)
  // get section details (subject_id, section_order_index)
  const [videoRows] = await pool.query(`
    SELECT v.id, v.order_index, s.order_index as section_order_index, s.subject_id
    FROM videos v
    JOIN sections s ON v.section_id = s.id
    WHERE v.id = ?
  `, [videoId]);

  if (videoRows.length === 0) return false;

  const targetVideo = videoRows[0];

  // get all videos for the subject ordered properly
  const [allVideosRows] = await pool.query(`
    SELECT v.id
    FROM videos v
    JOIN sections s ON v.section_id = s.id
    WHERE s.subject_id = ?
    ORDER BY s.order_index ASC, v.order_index ASC
  `, [targetVideo.subject_id]);

  const currentIndex = allVideosRows.findIndex(v => v.id === targetVideo.id);

  if (currentIndex === 0) {
    return true; // First video is always unlocked
  }

  const prevVideo = allVideosRows[currentIndex - 1];

  // Check if prev video is completed
  const [progressRows] = await pool.query(`
    SELECT is_completed FROM progress WHERE user_id = ? AND video_id = ?
  `, [userId, prevVideo.id]);

  if (progressRows.length === 0) return false;

  return Boolean(progressRows[0].is_completed);
}

module.exports = {
  enrichVideosWithLockStatus,
  canUnlockVideo
};
