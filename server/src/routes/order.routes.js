import express from 'express';
import { protectRoute } from "../middlewares/auth.middleware.js";
import { 
  getAllOrders, 
  createOrder, 
  updateOrderStatus, 
  getUserOrders 
} from '../controllers/order.controller.js';

const router = express.Router();

router.get('/', protectRoute, getAllOrders);
router.post('/', protectRoute, createOrder);
router.put('/:id/status', protectRoute, updateOrderStatus);
router.get('/user', protectRoute, getUserOrders);

export default router;