import express from 'express';
import {protectRoute} from "../middlewares/auth.middleware.js";
import { getAllProducts } from '../controllers/product.controller.js';

const router = express.Router();


router.get('/',protectRoute,getAllProducts);


export default router;