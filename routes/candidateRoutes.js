import express, { Router } from "express";
import upload from "../middleware/upload.js";
import authorizeRole from "../middleware/authorizeRole.js";
import {
  forwardCandidateToSales,
  getLeadsCandidates,
  getRecruiterCandidates,
  getSalesCandidates,
  submitCandidate,
  uploadCandidateWithResume,
} from "../controller/candidateController.js";

const candidateRoutes = Router();

// ------------------- RECRUITER -------------------
candidateRoutes.post(
  "/recruiter/submit",
  authorizeRole(["recruiter"]),
  submitCandidate
);
candidateRoutes.post(
  "/recruiter/upload",
  authorizeRole(["recruiter"]),
  upload.array("resumes", 5),
  uploadCandidateWithResume
);

// Add this route:
candidateRoutes.get(
  "/recruiter/my-candidates/:userEmail",
  authorizeRole(["recruiter"]),
  getRecruiterCandidates
);

// ------------------- LEADS -------------------
candidateRoutes.get("/leads", authorizeRole(["leads"]), getLeadsCandidates);
candidateRoutes.post(
  "/leads/forward/:id",
  authorizeRole(["leads"]),
  forwardCandidateToSales
);

// ------------------- SALES -------------------
candidateRoutes.get("/sales", authorizeRole(["admin"]), getSalesCandidates);

export default candidateRoutes;
