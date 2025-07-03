const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRole = require('../middleware/authorizeRole');

// View team members (sales, leads can read)
router.get(
  '/',
  authenticateToken,
  authorizeRole('team', 'read'),
  (req, res) => {
    res.json({ message: '👥 Team members retrieved successfully' });
  }
);

// Add a team member (only sales can write)
router.post(
  '/',
  authenticateToken,
  authorizeRole('team', 'write'),
  (req, res) => {
    res.json({ message: '✅ Team member added' });
  }
);

module.exports = router;
