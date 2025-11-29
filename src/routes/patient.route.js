import express from 'express';
import { createPatient, getAllPatients, getPatient, updatePatient, deletePatient } from '../controllers/patient.controller.js';
import { authenticateJWT, authorize } from '../middleware/middleware.js';
import { ROLES } from '../Utils/index.utils.js';

const router = express.Router();
router.get('/', authenticateJWT, getAllPatients);
router.get('/:id', authenticateJWT, getPatient);
router.put('/:id', authenticateJWT, updatePatient);
router.delete('/:id', authenticateJWT, authorize([ROLES.ADMIN, ROLES.ASSISTANT]), deletePatient);
router.post('/', createPatient);
export default router;