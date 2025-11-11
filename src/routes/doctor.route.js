import express from 'express';
import { createDoctor, doctorLogin, getProfile, updateProfile } from '../controllers/doctor.controller.js';
import { authenticateJWT } from '../controllers/Auth/middleware.js';

const router = express.Router();

router.post('/register', createDoctor);
router.post('/login', doctorLogin)
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

export default router;