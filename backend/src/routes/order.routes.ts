import { Router } from 'express';
import {
  getOrder,
  getOrderStatus,
  placeOrder,
  streamOrderStatus,
  updateOrderStatus,
} from '../controllers/order.controller';

const router = Router();

router.post('/', placeOrder);
router.get('/:id', getOrder);
router.get('/:id/status', getOrderStatus);
router.patch('/:id/status', updateOrderStatus);
router.get('/:id/stream', streamOrderStatus);

export default router;
