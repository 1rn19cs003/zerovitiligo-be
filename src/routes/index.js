import express from 'express';
import userRoutes from './patient.route.js';
import doctorRoutes from './doctor.route.js';
import statusRoutes from './status.route.js';
import appointmentRoutes from './appointment.route.js';
import youtubeRoutes from './youtube.route.js';
import visitorRoutes from './visitor.route.js';
import medicineDiaryRoutes from './medicineDiary.route.js';
import cloudinaryRoutes from './cloudinary.route.js';
import exportRoutes from './export.route.js';


const router = express.Router();

router.use('/patients', userRoutes);
router.use('/doctor', doctorRoutes);
router.use('/status', statusRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/youtube', youtubeRoutes);
router.use('/visitor', visitorRoutes);
router.use('/medicine-diary', medicineDiaryRoutes);
router.use('/cloudinary', cloudinaryRoutes);
router.use('/export', exportRoutes);

export default router;