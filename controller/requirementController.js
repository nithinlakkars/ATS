// controller/requirementController.js
import Requirement from "../model/Requirement.js";

// 🎯 Submit requirement with custom ID
export const submitRequirement = async (req, res) => {
  const {
    title,
    description,
    leadEmails,
    locations,
    employmentType,
    workSetting,
    rate,
    primarySkills,
  } = req.body;

  if (!title || !description || !leadEmails) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // 📌 Generate custom requirement ID
  const now = new Date();
  const formattedDate = now.toISOString().replace(/[-T:.Z]/g, "").slice(0, 14); // e.g. 20250717143100
  const cleanTitle = title.replace(/\s+/g, "").substring(0, 10); // "Java Developer" → "JavaDevelo"
  const customRequirementId = `${cleanTitle}_${formattedDate}`;

  try {
    const newReq = await Requirement.create({
      requirementId: customRequirementId,
      title,
      description,
      createdBy: req.user.email,
      leadAssignedTo: leadEmails,
      status: "leadAssigned",
      locations,
      employmentType,
      workSetting,
      rate,
      primarySkills,
    });

    return res.status(201).json({
      newReq,
      status: "success",
      message: "Requirement submitted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to submit requirement",
      error: err.message,
    });
  }
};

export const viewSalesRequirements = async (req, res) => {
  try {
    const email = req.user.email;
    const data = await Requirement.find({ createdBy: email }).sort({
      createdAt: -1,
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch requirements" });
  }
};

export const recruiterViewRequirements = async (req, res) => {
  try {
    const { email } = req.query;
    const data = await Requirement.find({ recruiterAssignedTo: email }).sort({
      createdAt: -1,
    });
    return res.status(200).json({
      data,
      message: "✅ Requirements fetched successfully",
      status: true,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch requirements" });
  }
};

export const assignMultipleRequirements = async (req, res) => {
  const { requirementIds, recruiterEmails, leadEmail } = req.body;

  if (
    !requirementIds ||
    !Array.isArray(requirementIds) ||
    !recruiterEmails ||
    !Array.isArray(recruiterEmails) ||
    !leadEmail
  ) {
    return res
      .status(400)
      .json({ message: "Missing or invalid fields" });
  }

  try {
    const result = await Requirement.updateMany(
      { _id: { $in: requirementIds } },
      {
        $set: {
          recruiterAssignedTo: recruiterEmails,
          status: "recruiterAssigned",
        },
        $addToSet: {
          recruiterAssignedBy: leadEmail,
        },
      }
    );

    res.status(200).json({
      message: `✅ Successfully assigned ${recruiterEmails.length} recruiter(s) to ${requirementIds.length} requirement(s).`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ message: "❌ Internal server error", error });
  }
};

export const unassignedRequirements = async (req, res) => {
  try {
    const leadEmail = req.user.email;
    const reqs = await Requirement.find({
      leadAssignedTo: leadEmail,
      $or: [
        { recruiterAssignedTo: { $exists: false } },
        { recruiterAssignedTo: { $size: 0 } },
      ],
    });
    res.json(reqs);
  } catch (err) {
    res.status(500).json({ error: "Failed to load unassigned requirements" });
  }
};

export const myLeadRequirements = async (req, res) => {
  try {
    const email = req.user.email;
    const reqs = await Requirement.find({ leadAssignedTo: email });
    res.json(reqs);
  } catch (err) {
    res.status(500).json({ error: "Failed to load your requirements" });
  }
};

export const assignRequirement = async (req, res) => {
  const { recruiterEmails, leadEmail } = req.body;

  if (!Array.isArray(recruiterEmails) || recruiterEmails.length === 0) {
    return res
      .status(400)
      .json({ message: "❌ At least one recruiter must be selected" });
  }

  try {
    await Requirement.findByIdAndUpdate(req.params.reqId, {
      recruiterAssignedTo: recruiterEmails,
      $addToSet: { recruiterAssignedBy: leadEmail },
      status: "recruiterAssigned",
    });
    res.json({ message: "✅ Requirement assigned to selected recruiters" });
  } catch (error) {
    res.status(500).json({ message: "❌ Internal Server Error" });
  }
};

export const viewAllRequirements = async (req, res) => {
  try {
    const data = await Requirement.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch all requirements" });
  }
};

export const viewUnassignedLeads = async (req, res) => {
  try {
    const data = await Requirement.find({
      $or: [
        { recruiterAssignedTo: { $exists: false } },
        { recruiterAssignedTo: { $size: 0 } },
      ],
    }).sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to load unassigned requirements" });
  }
};

export const authenticatedLeadRequirements = async (req, res) => {
  try {
    const requirements = await Requirement.find({
      leadAssignedTo: req.user.email,
    });
    res.json(requirements);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch requirements" });
  }
};
