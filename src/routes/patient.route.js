import express from 'express';
import { createPatient, getAllPatients, getPatient } from '../controllers/patient.controller.js';

const router = express.Router();
router.get('/', getAllPatients);
router.get('/:id', getPatient);
router.post('/', createPatient);
export default router;