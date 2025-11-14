import express from 'express';
import { createAppointment, getAppointmentsByDoctor } from '../controllers/appointment.controller.js';

const router = express.Router();

router.post('/', createAppointment);
router.get('/', getAppointmentsByDoctor)

export default router;