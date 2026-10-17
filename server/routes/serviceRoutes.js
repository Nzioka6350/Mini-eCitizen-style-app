import express from 'express';
import { getServices, createService, deleteService } from '../controllers/serviceController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getServices);
router.post('/', protect, authorize('admin'), createService);
router.delete('/:id', protect, authorize('admin'), deleteService);

export default router;