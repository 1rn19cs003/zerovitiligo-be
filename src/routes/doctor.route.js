import express from 'express';
import { createDoctor, doctorLogin, doctorLogout, refreshToken, getAllDoctors, getProfile, getProfileById, updateProfile } from '../controllers/doctor.controller.js';
import { authenticateJWT } from '../middleware/middleware.js';

const router = express.Router();

router.post('/register', authenticateJWT, createDoctor);
router.post('/login', doctorLogin);
router.post('/logout', doctorLogout);
router.post('/refresh-token', refreshToken); // No auth required - validates refresh token itself
router.get('/profile', authenticateJWT, getProfile);
router.put('/profile', authenticateJWT, updateProfile);
router.get('/profileId/', authenticateJWT, getProfileById);
router.get('/', authenticateJWT, getAllDoctors);

export default router;