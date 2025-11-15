import express from 'express';
import { createAppointment, getAppointmentsByDoctor, getAppointmentsByPatient, updateAppointmentByAppointmentId } from '../controllers/appointment.controller.js';

const router = express.Router();

router.post('/', createAppointment);
router.get('/', getAppointmentsByDoctor)
router.get('/patient/', getAppointmentsByPatient)
router.patch('/', updateAppointmentByAppointmentId)

export default router;