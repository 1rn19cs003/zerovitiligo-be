import express from 'express';
import { getVisitorCount, incrementVisitorCount } from '../controllers/visitor.controller.js';

const router = express.Router();

router.get('/count', getVisitorCount);
router.post('/increment', incrementVisitorCount);

export default router;
