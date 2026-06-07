import { Router } from 'express';
import { getInsights } from '../controllers/dashboard.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.get('/insights', getInsights);

export default router;
