import express from 'express';
import { createPatient, getAllPatients, getPatient, updatePatient } from '../controllers/patient.controller.js';

const router = express.Router();
router.get('/', getAllPatients);
router.get('/:id', getPatient);
router.put('/:id', updatePatient);
router.post('/', createPatient);
export default router;