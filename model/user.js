// models/User.js
import mongoose, { Schema } from "mongoose";
// const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "lead", "recruiter"],
    },
    team: {
      type: String,
      enum: ["OmPrakash Team", "Ravi Team", null],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ prevent OverwriteModelError
export default mongoose.model("user", userSchema);
