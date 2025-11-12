import express from 'express';
import userRoutes from './patient.route.js';
import doctoerRoutes from './doctor.route.js';
import statusRoutes from './status.route.js';

const router = express.Router();

router.use('/patients', userRoutes);
router.use('/doctor', doctoerRoutes);
router.use('/status', statusRoutes);

export default router;