import express from 'express';
import { createPatient, getAllPatients } from '../controllers/patient.controller.js';

const router = express.Router();
router.get('/', getAllPatients);
router.post('/', createPatient);
export default router;