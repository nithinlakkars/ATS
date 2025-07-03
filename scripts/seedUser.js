// scripts/seedUser.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ats', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function seed() {
  const users = [
    // Sales
    { username: 'sales1', email: 'sales1@procorp.com', password: '123456', role: 'sales', team: null },

    // Leads
    { username: 'omprakash', email: 'omprakash@procorp.com', password: '123456', role: 'leads', team: 'OmPrakash Team' },
    { username: 'ravi',      email: 'ravi@procorp.com',      password: '123456', role: 'leads', team: 'Ravi Team' },

    // OmPrakash Team Recruiters
    { username: 'rec1', email: 'rec1@procorp.com', password: '123456', role: 'recruiter', team: 'OmPrakash Team' },
    { username: 'rec2', email: 'rec2@procorp.com', password: '123456', role: 'recruiter', team: 'OmPrakash Team' },

    // Ravi Team Recruiters
    { username: 'rec3', email: 'rec3@procorp.com', password: '123456', role: 'recruiter', team: 'Ravi Team' },
    { username: 'rec4', email: 'rec4@procorp.com', password: '123456', role: 'recruiter', team: 'Ravi Team' },
  ];

  for (const user of users) {
    const { password, ...rest } = user;
    const hashed = await bcrypt.hash(password, 10);
    await User.create({ ...rest, password: hashed });
  }

  console.log('Users seeded with teams and roles');
  mongoose.disconnect();
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  mongoose.disconnect();
});
