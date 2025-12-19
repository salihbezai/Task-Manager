import { Router } from 'express';
import { adminOnly, protect } from '../middlewares/authMiddleware';
import { exportTaskReport } from '../controllers/reportController';

const router = Router();

// export task repoert
router.get('/export/tasks', protect, adminOnly,exportTaskReport);

// export user report
    // router.get('/export/users', protect, adminOnly, exportUserReport);
export default router;