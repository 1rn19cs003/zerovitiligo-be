import express from 'express';
import { addNewUrl, getAllUrl } from '../controllers/youtube.controller.js';
import { authenticateJWT } from '../middleware/middleware.js';

const router = express.Router();
router.get('/', getAllUrl);
router.post('/', authenticateJWT, addNewUrl);
export default router;