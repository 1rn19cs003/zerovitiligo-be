import express from 'express';
import { createDoctor, doctorLogin } from '../controllers/doctor.controller.js';

const router = express.Router();

router.post('/register', createDoctor);

router.post('/login',doctorLogin)

export default router;