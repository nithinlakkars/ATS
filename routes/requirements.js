const express = require('express');
const Requirement = require('../models/Requirement');
const router = express.Router();

/** -------------------- SALES ENDPOINTS -------------------- **/

// POST /api/requirements/sales/submit
router.post('/sales/submit', async (req, res) => {
  const {
    title,
    description,
    createdBy,
    leadAssignedTo,
    leadAssignedBy,
    locations,
    employmentType,
    workSetting,
    rate,
    primarySkills
  } = req.body;

  if (!title || !description || !createdBy || !leadAssignedTo || !leadAssignedBy) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newReq = await Requirement.create({
      title,
      description,
      createdBy,
      leadAssignedTo,
      leadAssignedBy,
      status: 'leadAssigned',
      locations,
      employmentType,
      workSetting,
      rate,
      primarySkills
    });

    res.json(newReq);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit requirement' });
  }
});

// GET /api/requirements/sales/view?email=<salesEmail>
router.get('/sales/view', async (req, res) => {
  try {
    const { email } = req.query;
    const data = await Requirement.find({ createdBy: email }).sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch requirements' });
  }
});


/** -------------------- LEADS ENDPOINTS -------------------- **/

// GET /api/requirements/leads/unassigned?leadEmail=<leadEmail>
router.get('/leads/unassigned', async (req, res) => {
  try {
    const { leadEmail } = req.query;
    const reqs = await Requirement.find({
      leadAssignedTo: leadEmail,
      $or: [
        { recruiterAssignedTo: { $exists: false } },
        { recruiterAssignedTo: { $size: 0 } }
      ]
    });
    res.json(reqs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load unassigned requirements' });
  }
});

// GET /api/requirements/leads/my?email=<leadEmail>
router.get('/leads/my', async (req, res) => {
  try {
    const { email } = req.query;
    const reqs = await Requirement.find({ leadAssignedTo: email });
    res.json(reqs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load your requirements' });
  }
});

// PUT /api/requirements/leads/assign/:reqId
router.put('/leads/assign/:reqId', async (req, res) => {
  const { recruiterEmails, leadEmail } = req.body;

  if (!Array.isArray(recruiterEmails) || recruiterEmails.length === 0) {
    return res.status(400).json({ message: "❌ At least one recruiter must be selected" });
  }

  try {
    await Requirement.findByIdAndUpdate(req.params.reqId, {
      recruiterAssignedTo: recruiterEmails,
      $addToSet: { recruiterAssignedBy: leadEmail },
      status: 'recruiterAssigned'
    });

    return res.json({ message: "✅ Requirement assigned to selected recruiters" });
  } catch (error) {
    console.error("❌ Assignment failed:", error);
    return res.status(500).json({ message: "❌ Internal Server Error" });
  }
});

// PUT /api/requirements/leads/assign-multiple
router.put('/leads/assign-multiple', async (req, res) => {
  const { requirementIds, recruiterEmails, leadEmail } = req.body;

  if (!requirementIds || !Array.isArray(requirementIds) || !recruiterEmails || !Array.isArray(recruiterEmails) || !leadEmail) {
    return res.status(400).json({ message: 'Missing or invalid fields' });
  }

  try {
    const result = await Requirement.updateMany(
      { _id: { $in: requirementIds } },
      {
        $set: {
          recruiterAssignedTo: recruiterEmails,
          status: 'recruiterAssigned'
        },
        $addToSet: {
          recruiterAssignedBy: leadEmail
        }
      }
    );

    res.status(200).json({
      message: `✅ Successfully assigned ${recruiterEmails.length} recruiter(s) to ${requirementIds.length} requirement(s).`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('❌ Bulk assignment error:', error);
    res.status(500).json({ message: '❌ Internal server error' });
  }
});

// GET /api/requirements/leads/view-all
router.get('/leads/view-all', async (req, res) => {
  try {
    const data = await Requirement.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch all requirements' });
  }
});

// GET /api/requirements/leads/view
router.get('/leads/view', async (req, res) => {
  try {
    const data = await Requirement.find({
      $or: [
        { recruiterAssignedTo: { $exists: false } },
        { recruiterAssignedTo: { $size: 0 } }
      ]
    }).sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load unassigned requirements' });
  }
});

/** -------------------- RECRUITER ENDPOINTS -------------------- **/

// GET /api/requirements/recruiter/view?email=<recruiterEmail>
router.get('/recruiter/view', async (req, res) => {
  try {
    const { email } = req.query;
    const data = await Requirement.find({ recruiterAssignedTo: email }).sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch requirements' });
  }
});


module.exports = router;