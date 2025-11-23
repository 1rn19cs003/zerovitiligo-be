import express from 'express';
import { addNewUrl, getAllUrl } from '../controllers/youtube.controller.js';

const router = express.Router();
router.get('/', getAllUrl);
router.post('/', addNewUrl);
export default router;