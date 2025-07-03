const express = require('express');
const router = express.Router();
const authorizeRole = require('../middleware/authorizeRole');
const { authenticateToken } = require('../middleware/authenticateToken'); // your existing auth middleware

// Protect routes
router.post('/create', authenticateToken, authorizeRole('projects', 'create'), async (req, res) => {
  // create project logic
});

router.get('/list', authenticateToken, authorizeRole('projects', 'read'), async (req, res) => {
  // list projects logic
});

module.exports = router;
