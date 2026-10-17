import express from 'express';
import { getAllRequests, updateRequestStatus, getAnalytics } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);
router.use(authorize('admin', 'officer'));

router.get('/requests', getAllRequests);
router.patch('/requests/:id/status', updateRequestStatus);
router.get('/analytics', authorize('admin'), getAnalytics);

export default router;