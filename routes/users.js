// routes/users.js
const express = require('express');
const User = require('../models/user');
const router = express.Router();

/**
 * GET /api/users/leads
 * Fetch all users with role: 'leads'
 */
router.get('/leads', async (req, res) => {
  try {
    const leads = await User.find({ role: 'leads' }, 'email username');
    res.json(leads.map(user => ({
      email: user.email,
      name: user.username
    })));
  } catch (err) {
    console.error('Error fetching leads:', err);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

/**
 * GET /api/users/recruiters
 * Optional query param: ?team=TeamName
 * - If team is given → return only recruiters in that team
 * - If no team → return all recruiters
 */
router.get('/recruiters', async (req, res) => {
  try {
    const query = { role: 'recruiter' };

    if (req.query.team) {
      query.team = req.query.team;
    }

    const recruiters = await User.find(query, 'email username');
    res.json(recruiters.map(user => ({
      email: user.email,
      name: user.username
    })));
  } catch (err) {
    console.error('Error fetching recruiters:', err);
    res.status(500).json({ error: 'Failed to fetch recruiters' });
  }
});

module.exports = router;
