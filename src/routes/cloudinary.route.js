import express from 'express';
import { deleteImage, listImages, getUploadSignature } from '../controllers/cloudinary.controller.js';
import { authenticateJWT, authorize } from '../middleware/middleware.js';
import { ROLES } from '../Utils/index.utils.js';

const router = express.Router();

router.delete('/delete/:publicId', authenticateJWT, authorize([ROLES.ADMIN]), deleteImage);
router.get('/list', listImages);
router.post('/signature', authenticateJWT, authorize([ROLES.ADMIN]), getUploadSignature);

export default router;
