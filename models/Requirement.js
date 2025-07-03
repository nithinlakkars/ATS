const mongoose = require('mongoose');

const requirementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },

  createdBy: { type: String, required: true },       // Sales email or username
  leadAssignedTo: { type: String, required: true },  // Lead email
  leadAssignedBy: { type: String },                  // Sales who assigned to lead

  recruiterAssignedTo: { type: [String], default: [] }, // Multiple recruiters
  recruiterAssignedBy: { type: [String], default: [] },

  locations: { type: [String], default: [] },            // ✅ Multi-location
  employmentType: { type: String },                      // ✅ C2C, W2, Full-Time
  workSetting: { type: String },                         // ✅ Onsite, Remote, Hybrid
  rate: { type: String },                                // ✅ $30-40/hr, etc.
  primarySkills: { type: String },                       // ✅ Text string

  status: {
    type: String,
    enum: ['new', 'leadAssigned', 'recruiterAssigned', 'inProgress', 'closed'],
    default: 'new',
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Requirement', requirementSchema);
