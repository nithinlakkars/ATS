const express = require('express');
const router = express.Router();

const authenticateToken = require('../middleware/authenticateToken');
const authorizeRole = require('../middleware/authorizeRole');

// ✅ Create Task
router.post('/', authenticateToken, authorizeRole('tasks', 'write'), (req, res) => {
  // Your task creation logic here
  res.json({ message: '✅ Task created successfully' });
});

// ✅ Get All Tasks
router.get('/', authenticateToken, authorizeRole('tasks', 'read'), (req, res) => {
  // Your fetch logic here
  res.json({ message: '✅ Tasks fetched successfully' });
});

// ✅ Update Task
router.put('/:id', authenticateToken, authorizeRole('tasks', 'update'), (req, res) => {
  // Your update logic here
  res.json({ message: `✅ Task ${req.params.id} updated successfully` });
});

// ✅ Delete Task
router.delete('/:id', authenticateToken, authorizeRole('tasks', 'delete'), (req, res) => {
  // Your delete logic here
  res.json({ message: `✅ Task ${req.params.id} deleted successfully` });
});

module.exports = router;
