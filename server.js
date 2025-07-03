const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Routes
const candidateRoutes = require('./routes/candidates');
const authRoutes = require('./routes/auth');
const requirementRoutes = require('./routes/requirements');
const userRoutes = require('./routes/users'); // ✅ Add this
const taskRoutes = require('./routes/tasks');
const teamRoutes = require('./routes/team');
const reportRoutes = require('./routes/reports');
const settingRoutes = require('./routes/settings');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Route Mounting
app.use('/api/candidates', candidateRoutes);
app.use('/api/requirements', requirementRoutes);
app.use('/api/users', userRoutes); // ✅ Correctly mounted
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/settings', settingRoutes);

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/ats', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Failed:', err.message));

// Server Listen
app.listen(5000, () => console.log('🚀 Server running on http://localhost:5000'));
