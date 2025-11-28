import express from "express";
import { createEntry, getEntriesByPatient, deleteEntry } from "../controllers/medicineDiary.controller.js";
import { authenticateJWT } from "../middleware/middleware.js";

const router = express.Router();

// All routes require authentication
// router.use(authenticateJWT);

// Create a new medicine diary entry
router.post("/", createEntry);

// Get all medicine diary entries for a patient
router.get("/:patientId", getEntriesByPatient);

// Delete a medicine diary entry (Admin only)
router.delete("/:id", deleteEntry);

export default router;
