// models/Candidate.js
import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    candidateId: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    rate: {
      type: String,
    },
    source: {
      type: String,
    },
    currentLocation: {
      type: String,
    },
    relocation: {
      type: String,
      enum: ["Yes", "No"],
    },
    passportnumber: {
      type: String,
    },
    Last4digitsofSSN: {
      type: String,
    },
    LinkedinUrl: {
      type: String,
    },
    resumeUrls: {
      type: [String],
    },
    VisaStatus: {
      type: String,
    },
    clientdetails: {
      type: String,
    },
    addedBy: {
      type: String, // Recruiter who added
    },
    forwardedBy: {
      type: String, // Lead who forwarded to Sales
    },
    notes: {
      type: String,
    },

    // 🔗 Linked Requirement
    requirementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Requirement",
    },


    // 🚦 Source Role
    sourceRole: {
      type: String,
      required: true, // recruiter or lead
    },

    // 🔄 Workflow Status
    status: {
      type: String,
      enum: ["submitted", "forwarded-to-leads", "forwarded-to-sales"],
      default: "submitted",
    },

    // 🧹 Soft Delete
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Candidate", candidateSchema);
