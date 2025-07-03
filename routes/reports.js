const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRole = require('../middleware/authorizeRole');

// View reports (sales and leads can read)
router.get(
  '/',
  authenticateToken,
  authorizeRole('reports', 'read'),
  (req, res) => {
    res.json({ message: '📊 Reports accessed successfully' });
  }
);

// Create report (only sales can write)
router.post(
  '/',
  authenticateToken,
  authorizeRole('reports', 'write'),
  (req, res) => {
    res.json({ message: '📝 Report submitted successfully' });
  }
);

module.exports = router;
