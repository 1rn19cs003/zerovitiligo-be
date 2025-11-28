import express from "express";
import { createEntry, getEntriesByPatient, deleteEntry } from "../controllers/medicineDiary.controller.js";
import { authenticateJWT } from "../middleware/middleware.js";

const router = express.Router();

router.post("/", authenticateJWT, createEntry);
router.get("/:patientId", authenticateJWT, getEntriesByPatient);
router.delete("/:id", authenticateJWT, deleteEntry);

export default router;
