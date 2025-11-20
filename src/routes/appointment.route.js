import express from 'express';
import { createAppointment, getAppointmentsByDoctor, getAppointmentsByPatient, updateAppointmentByAppointmentId } from '../controllers/appointment.controller.js';
import { authenticateJWT } from 'src/Auth/middleware.js';

const router = express.Router();

router.post('/',authenticateJWT, createAppointment);
router.get('/',authenticateJWT, getAppointmentsByDoctor)
router.get('/patient/',authenticateJWT, getAppointmentsByPatient)
router.patch('/',authenticateJWT, updateAppointmentByAppointmentId)

export default router;