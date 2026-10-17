import express from 'express';
import { createRequest, getMyRequests, getRequestById } from '../controllers/requestController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);

router.post('/', createRequest);
router.get('/my-requests', getMyRequests);
router.get('/:id', getRequestById);

export default router;