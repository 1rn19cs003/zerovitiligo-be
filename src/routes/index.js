import express from 'express';
import userRoutes from './patient.route.js';

const router = express.Router();

router.use('/patients', userRoutes);

export default router;