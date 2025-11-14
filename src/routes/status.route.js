import express from 'express';
import { getAllAppointmentStatus, getAllStatus } from '../controllers/status.controller.js';

const router = express.Router();

router.get('/', getAllStatus);
router.get('/appointment', getAllAppointmentStatus);

export default router;