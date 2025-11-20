import express from 'express';
import { createDoctor, doctorLogin, doctorLogout, getAllDoctors, getProfile, getProfileById, updateProfile } from '../controllers/doctor.controller.js';
import { authenticateJWT } from '../middleware/middleware.js';

const router = express.Router();

router.post('/register', authenticateJWT, createDoctor);
router.post('/login', doctorLogin)
router.post('/logout', doctorLogout)
router.get('/profile', authenticateJWT, getProfile);
router.put('/profile', authenticateJWT, updateProfile);
router.get('/profileId/', authenticateJWT, getProfileById);
router.get('/', authenticateJWT, getAllDoctors);

export default router;