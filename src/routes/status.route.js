import express from 'express';
import { getAllAppointmentStatus, getAllStatus } from '../controllers/status.controller.js';
import { authenticateJWT } from '../middleware/middleware.js';

const router = express.Router();

router.get('/',authenticateJWT, getAllStatus);
router.get('/appointment',authenticateJWT, getAllAppointmentStatus);

export default router;