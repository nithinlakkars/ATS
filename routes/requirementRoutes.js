import express from "express";
import {
  submitRequirement,
  viewSalesRequirements,
  unassignedRequirements,
  myLeadRequirements,
  assignRequirement,
  assignMultipleRequirements,
  viewAllRequirements,
  viewUnassignedLeads,
  recruiterViewRequirements,
  authenticatedLeadRequirements,
} from "../controller/requirementController.js";

import authorizeRole from "../middleware/authorizeRole.js";
import authMiddleware from "../middleware/authMiddleware.js";
import authenticateToken from "../middleware/authenticateToken.js";

const requirementRouter = express.Router();
requirementRouter.post(
  "/sales/submit",
  authMiddleware(["sales", "leads", "admin"]), // or whatever roles you have
  submitRequirement
);
requirementRouter.get(
  "/sales/view",
  authenticateToken,
  authorizeRole("admin"),
  viewSalesRequirements
);
requirementRouter.get(
  "/leads/unassigned",
  authenticateToken,
  authorizeRole("leads"),
  unassignedRequirements
);
requirementRouter.put(
  "/leads/assign-multiple",
  authenticateToken,
  authorizeRole("leads"),
  assignMultipleRequirements
);
requirementRouter.get(
  "/leads/my",
  authenticateToken,
  authorizeRole("leads"),
  myLeadRequirements
);
requirementRouter.put(
  "/leads/assign/:reqId",
  authenticateToken,
  authorizeRole("Lead"),
  assignRequirement
);

requirementRouter.get(
  "/leads/view-all",
  authenticateToken,
  authorizeRole("admin"),
  viewAllRequirements
);
requirementRouter.get(
  "/leads/view",
  authenticateToken,
  authorizeRole("Lead"),
  viewUnassignedLeads
);
requirementRouter.get(
  "/recruiter/view",
  authenticateToken,
  authorizeRole("Recruiter"),
  recruiterViewRequirements
);
requirementRouter.get(
  "/leads/view-auth",
  authMiddleware,
  authenticatedLeadRequirements
);

export default requirementRouter;
