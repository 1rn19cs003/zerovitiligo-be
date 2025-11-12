import express from 'express';
import { getAllStatus } from '../controllers/status.controller.js';

const router = express.Router();

router.get('/', getAllStatus);

export default router;