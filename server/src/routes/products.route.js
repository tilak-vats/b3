import express from 'express';
import {protectRoute} from "../middlewares/auth.middleware.js";
import { getAllProducts, categorizeProducts, updateProduct } from '../controllers/product.controller.js';

const router = express.Router();

router.get('/', protectRoute, getAllProducts);
router.post('/categorize', protectRoute, categorizeProducts);
router.put('/:id', protectRoute, updateProduct);

export default router;