const express = require('express');
const router = express.Router();
const aiController = require('./controller');
const authenticate = require('../../middleware/auth');

// We allow both authenticated and unauthenticated chat
router.post('/chat', (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // If token exists, use authenticate middleware
    return authenticate(req, res, next);
  }
  
  // Otherwise, proceed as guest
  next();
}, aiController.chat);

module.exports = router;
