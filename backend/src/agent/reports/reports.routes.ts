import { Router } from 'express';
import submitManualReport from './reports.controller';
import authMiddleware from '../../middlewares/auth.middleware';

const router = Router();
router.post('/report-issue', authMiddleware, submitManualReport);
export default router;
