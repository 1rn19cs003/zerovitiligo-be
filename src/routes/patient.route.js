import express from 'express';
import { createPatient, getAllPatients, getPatient, updatePatient } from '../controllers/patient.controller.js';
import { authenticateJWT } from 'src/Auth/middleware.js';

const router = express.Router();
router.get('/', authenticateJWT, getAllPatients);
router.get('/:id', authenticateJWT, getPatient);
router.put('/:id', authenticateJWT, updatePatient);
router.post('/', createPatient);
export default router;