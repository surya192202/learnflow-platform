const express = require('express');
const router = express.Router();
const progressController = require('./controller');
const authenticate = require('../../middleware/auth');

router.get('/subjects/:subjectId', authenticate, progressController.getSubjectProgress);
router.get('/videos/:videoId', authenticate, progressController.getVideoProgress);
router.post('/videos/:videoId', authenticate, progressController.updateVideoProgress);

module.exports = router;
