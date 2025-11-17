import express from 'express';
import { createDoctor, doctorLogin, getAllDoctors, getProfile, updateProfile } from '../controllers/doctor.controller.js';
import { authenticateJWT } from '../controllers/Auth/middleware.js';

const router = express.Router();

router.post('/register', createDoctor);
router.post('/login',doctorLogin)
router.get('/profile', authenticateJWT, getProfile);
router.put('/profile', authenticateJWT, updateProfile);
router.get('/', getAllDoctors);

export default router;