import express from "express";
import { createEntry, getEntriesByPatient, deleteEntry } from "../controllers/medicineDiary.controller.js";
import { authenticateJWT, authorize } from "../middleware/middleware.js";
import { ROLES } from "../Utils/index.utils.js";

const router = express.Router();

router.post("/", authenticateJWT, authorize([ROLES.ADMIN]), createEntry);
router.get("/:patientId", authenticateJWT, authorize([ROLES.ADMIN, ROLES.ASSISTANT]), getEntriesByPatient);
router.delete("/:id", authenticateJWT, authorize([ROLES.ADMIN]), deleteEntry);

export default router;
