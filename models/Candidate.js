const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  role: String,         // ✅ Added role
  rate: String,         // ✅ Added rate
  source: String,       // ✅ Added source
  resumeUrl: String,
  sourceRole: String,   // 'recruiter', 'lead', etc.
  status: String,       // 'submitted', 'forwarded-to-lead', 'forwarded-to-sales'
  addedBy: String,
  forwardedBy: String,
  notes: String,
  requirementId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Requirement'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Candidate', candidateSchema);
