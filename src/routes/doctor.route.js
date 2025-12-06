import express from 'express';
import { createDoctor, doctorLogin, doctorLogout, refreshToken, getAllDoctors, getProfile, getProfileById, updateProfile, deleteDoctor } from '../controllers/doctor.controller.js';
import { authenticateJWT, authorize } from '../middleware/middleware.js';
import { ROLES } from '../Utils/index.utils.js';

const router = express.Router();

router.post('/register', authenticateJWT, authorize([ROLES.ADMIN, ROLES.ASSISTANT]), createDoctor);
router.post('/login', doctorLogin);
router.post('/logout', doctorLogout);
router.post('/refresh-token', refreshToken);
router.get('/profile', authenticateJWT, authorize([ROLES.ADMIN, ROLES.ASSISTANT]), getProfile);
router.put('/profile', authenticateJWT, authorize([ROLES.ADMIN]), updateProfile);
router.get('/profileId/', authenticateJWT, authorize([ROLES.ADMIN, ROLES.ASSISTANT]), getProfileById);
router.get('/', authenticateJWT, authorize([ROLES.ADMIN, ROLES.ASSISTANT]), getAllDoctors);
router.delete('/:doctorId', authenticateJWT, authorize([ROLES.ADMIN]), deleteDoctor);

export default router;