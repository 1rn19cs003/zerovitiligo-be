import express from 'express';
import { addNewUrl, getAllUrl } from '../controllers/youtube.controller.js';
import { authenticateJWT, authorize } from '../middleware/middleware.js';
import { ROLES } from '../Utils/index.utils.js';

const router = express.Router();
router.get('/', getAllUrl);
router.post('/', authenticateJWT, authorize([ROLES.ADMIN, ROLES.ASSISTANT]), addNewUrl);
export default router;