import express from 'express';
import { addNewUrl, deleteUrl, getAllUrl } from '../controllers/youtube.controller.js';
import { authenticateJWT, authorize } from '../middleware/middleware.js';
import { ROLES } from '../utils/index.utils.js';

const router = express.Router();
router.get('/', getAllUrl);
router.post('/', authenticateJWT, authorize([ROLES.ADMIN, ROLES.ASSISTANT]), addNewUrl);
router.delete('/:id', authenticateJWT, authorize([ROLES.ADMIN, ROLES.ASSISTANT]), deleteUrl);
export default router;