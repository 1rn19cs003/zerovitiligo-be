import express from 'express';
import { exportAllDataSSE } from '../controllers/export.controller.js';
import { authenticateJWT, authorize } from '../middleware/middleware.js';
import { ROLES } from '../utils/index.utils.js';

const router = express.Router();

router.get('/sse', authenticateJWT, authorize([ROLES.ADMIN]), exportAllDataSSE);

export default router;
