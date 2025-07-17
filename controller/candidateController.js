import Candidate from "../model/Candidate.js";
import { uploadToCloudinary } from "../utils/cloudinaryHelper.js";

// ✅ Utility: Generate candidate ID using name + date + time
const generateCandidateId = (name) => {
  const now = new Date();
  const dateStr = now.toISOString().split("T")[0].replace(/-/g, ""); // YYYYMMDD
  const timeStr = now
    .toTimeString()
    .split(" ")[0]
    .replace(/:/g, ""); // HHMMSS
  const safeName = name?.trim().toLowerCase().replace(/\s+/g, "") || "unknown";
  return `${safeName}_${dateStr}_${timeStr}`;
};

// ✅ Recruiter: Submit candidate without file
export const submitCandidate = async (req, res) => {
  try {
    const { name, requirementId, ...rest } = req.body;

    if (!name || !requirementId) {
      return res.status(400).json({ error: "Name and Requirement ID are required" });
    }

    const candidateId = generateCandidateId(name);

    const candidate = new Candidate({
      name,
      requirementId,
      candidateId,
      ...rest,
      sourceRole: "recruiter",
      status: "submitted",
    });

    await candidate.save();

    res.status(201).json({
      message: "✅ Candidate submitted by recruiter",
      candidate,
    });
  } catch (err) {
    console.error("❌ Error saving candidate:", err);
    res.status(500).json({ error: "❌ Failed to save candidate", details: err.message });
  }
};

// ✅ Recruiter: Submit candidate with resume upload
export const uploadCandidateWithResume = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "❌ No resume uploaded" });
    }

    const {
      name,
      email,
      phone,
      role,
      rate,
      source,
      currentLocation,
      relocation,
      passportNumber,
      last4SSN,
      linkedinUrl,
      visaStatus,
      clientDetails,
      addedBy,
      notes,
      requirementId,
    } = req.body;

    if (!name || !requirementId) {
      return res.status(400).json({ error: "Name and Requirement ID are required" });
    }

    const candidateId = generateCandidateId(name);

    const uploadedUrls = await Promise.all(
      req.files.map((file) =>
        uploadToCloudinary(file.buffer, file.originalname, "resumes")
      )
    );

    const candidate = new Candidate({
      name,
      email,
      phone,
      role,
      rate,
      source,
      currentLocation,
      relocation,
      passportnumber: passportNumber,
      Last4digitsofSSN: last4SSN,
      LinkedinUrl: linkedinUrl,
      VisaStatus: visaStatus,
      clientdetails: clientDetails,
      addedBy,
      notes,
      requirementId,
      resumeUrls: uploadedUrls,
      candidateId,
      sourceRole: "recruiter",
      status: "submitted",
    });

    await candidate.save();

    res.status(201).json({
      message: "✅ Candidate submitted with resume",
      candidate,
    });
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({
      error: "❌ Failed to upload candidate with resume",
      details: err.message,
    });
  }
};

// ✅ Leads: Get all submitted candidates
export const getLeadsCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find({
      $and: [
        { $or: [{ status: "submitted" }, { status: "forwarded-to-sales" }, { status: "new" }] },
        { $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] },
      ],
    }).populate("requirementId");

    res.status(200).json({
      message: "✅ Leads candidates fetched",
      candidates,
      status: true,
    });
  } catch (err) {
    console.error("❌ Failed to fetch leads candidates:", err);
    res.status(500).json({ error: "❌ Failed to fetch leads candidates" });
  }
};

// ✅ Leads: Forward candidate to sales
export const forwardCandidateToSales = async (req, res) => {
  try {
    const { forwardedBy } = req.body;
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      {
        status: "forwarded-to-sales",
        sourceRole: "leads",
        forwardedBy: forwardedBy || "unknown",
      },
      { new: true }
    );

    res.json({ message: "✅ Candidate forwarded to sales", candidate });
  } catch (err) {
    console.error("❌ Failed to forward candidate:", err);
    res.status(500).json({ error: "❌ Failed to forward candidate" });
  }
};

// ✅ Sales: Get forwarded candidates
export const getSalesCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find({
      status: "forwarded-to-sales",
    }).populate("requirementId");

    res.status(200).json({
      candidates,
      status: true,
      message: "✅ Sales candidates fetched successfully",
    });
  } catch (err) {
    console.error("❌ Failed to fetch sales candidates:", err);
    res.status(500).json({ error: "❌ Failed to fetch sales candidates" });
  }
};

// ✅ Recruiter: Get candidates by recruiter
export const getRecruiterCandidates = async (req, res) => {
  try {
    const { userEmail } = req.params;

    const candidates = await Candidate.find({
      addedBy: userEmail,
      $or: [{ sourceRole: "recruiter" }, { sourceRole: "leads" }],
      $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
    });

    res.status(200).json({
      message: "✅ Recruiter candidates fetched successfully",
      candidates,
      status: true,
    });
  } catch (err) {
    console.error("❌ Recruiter fetch failed:", err);
    res.status(500).json({ message: "❌ Failed to fetch recruiter candidates" });
  }
};
