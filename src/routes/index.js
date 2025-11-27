import express from 'express';
import userRoutes from './patient.route.js';
import doctoerRoutes from './doctor.route.js';
import statusRoutes from './status.route.js';
import appointmentRoutes from './appointment.route.js';
import youtubeRoutes from './youtube.route.js';
import visitorRoutes from './visitor.route.js';

const router = express.Router();

router.use('/patients', userRoutes);
router.use('/doctor', doctoerRoutes);
router.use('/status', statusRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/youtube', youtubeRoutes);
router.use('/visitor', visitorRoutes);

export default router;