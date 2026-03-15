const express = require('express');
const router = express.Router();
const videosController = require('./controller');
const authenticate = require('../../middleware/auth');

router.get('/:videoId', authenticate, videosController.getVideoById);

module.exports = router;
