const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const Requirement = require('../models/Requirement');
const multer = require('multer');
const path = require('path');

// ====== Multer Resume Storage Config ======
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // e.g., 168999123123.pdf
    }
});

const upload = multer({ storage: storage });

/* ------------------------- RECRUITER ENDPOINTS ------------------------- */

// POST /api/candidates/recruiter/submit
router.post('/recruiter/submit', async (req, res) => {
    try {
        const candidate = new Candidate({
            ...req.body,
            requirementId: req.body.requirementId, // 🆕 Job ID
            sourceRole: 'recruiter',
            status: 'submitted'
        });
        await candidate.save();
        res.status(201).json({ message: '✅ Candidate submitted by recruiter' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '❌ Failed to save candidate' });
    }
});

// POST /api/candidates/recruiter/upload
router.post('/recruiter/upload', upload.array('resumes', 5), async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      role,
      rate,
      source,
      addedBy,
      notes,
      requirementId
    } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: '❌ No resume uploaded' });
    }

    // ✅ Define resumeUrl safely
    const resumeUrl = `/uploads/${req.files[0].filename}`;

    const candidate = new Candidate({
      name,
      email,
      phone,
      role,
      rate,
      source,
      addedBy,
      notes,
      resumeUrl,
      requirementId,
      sourceRole: 'recruiter',
      status: 'submitted'
    });

    await candidate.save();
    return res.status(201).json({ message: '✅ Candidate submitted with resume', candidate });

  } catch (err) {
    console.error('❌ Upload error:', err);
    return res.status(500).json({ error: '❌ Failed to upload candidate with resume' });
  }
});


/* ------------------------- LEADS ENDPOINTS ------------------------- */

// GET /api/candidates/leads — view recruiter submissions
router.get('/leads', async (req, res) => {
    try {
        const candidates = await Candidate.find({ status: 'submitted' }).populate('requirementId');
        res.json(candidates);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '❌ Failed to fetch candidates for leads' });
    }
});

// POST /api/candidates/leads/forward/:id — forward candidate to sales
router.post('/leads/forward/:id', async (req, res) => {
    try {
        const { forwardedBy } = req.body;

        const candidate = await Candidate.findByIdAndUpdate(
            req.params.id,
            {
                status: 'forwarded-to-sales',
                sourceRole: 'leads',
                forwardedBy: forwardedBy || 'unknown'
            },
            { new: true }
        );

        res.json({ message: '✅ Candidate forwarded to sales', candidate });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '❌ Failed to forward candidate' });
    }
});

/* ------------------------- SALES ENDPOINT ------------------------- */

// GET /api/candidates/sales — view finalized candidates
router.get('/sales', async (req, res) => {
    try {
        const candidates = await Candidate.find({ status: 'forwarded-to-sales' }).populate('requirementId');
        res.json(candidates);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '❌ Failed to fetch sales candidates' });
    }
});

module.exports = router;
