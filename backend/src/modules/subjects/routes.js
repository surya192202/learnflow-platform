const express = require('express');
const router = express.Router();
const subjectsController = require('./controller');
const videosController = require('../videos/controller'); // Added for first-video
const authenticate = require('../../middleware/auth');

router.get('/', subjectsController.getAllSubjects);
router.get('/:subjectId', subjectsController.getSubjectById);
router.get('/:subjectId/tree', authenticate, subjectsController.getSubjectTree);
router.get('/:subjectId/first-video', authenticate, videosController.getFirstVideo);

module.exports = router;
