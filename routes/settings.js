const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRole = require('../middleware/authorizeRole');

// View settings (sales and leads can read)
router.get(
  '/',
  authenticateToken,
  authorizeRole('settings', 'read'),
  (req, res) => {
    res.json({ message: '⚙️ Settings retrieved' });
  }
);

// Update settings (only sales can write)
router.put(
  '/',
  authenticateToken,
  authorizeRole('settings', 'write'),
  (req, res) => {
    res.json({ message: '✅ Settings updated' });
  }
);

module.exports = router;
