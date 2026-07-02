import { Router } from 'express';
import multer from 'multer';
import uploadCV from './cv.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const router = Router();

router.post('/upload-cv', authMiddleware, upload.single('cv'), uploadCV);

export default router;
