import express from 'express';
import { createAppointment, getAppointmentsByDoctor, getAppointmentsByPatient, updateAppointmentByAppointmentId } from '../controllers/appointment.controller.js';
import { authenticateJWT, authorize } from '../middleware/middleware.js';
import { ROLES } from '../Utils/index.utils.js';

const router = express.Router();

router.post('/', authenticateJWT, authorize([ROLES.ADMIN, ROLES.ASSISTANT]), createAppointment);
router.get('/', authenticateJWT, authorize([ROLES.ADMIN, ROLES.ASSISTANT]), getAppointmentsByDoctor)
router.get('/patient/', authenticateJWT, authorize([ROLES.ADMIN, ROLES.ASSISTANT]), getAppointmentsByPatient)
router.patch('/', authenticateJWT, authorize([ROLES.ADMIN, ROLES.ASSISTANT]), updateAppointmentByAppointmentId)

export default router;