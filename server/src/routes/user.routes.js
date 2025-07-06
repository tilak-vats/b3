import express from 'express';
import {protectRoute} from "../middlewares/auth.middleware.js";
import { getCurrentUser, getUserProfile, syncUser, updateCart, updateProfile } from '../controllers/user.controller.js';

const router = express.Router();


router.get('/profile/:email',getUserProfile);
router.post('/sync',protectRoute,syncUser);
router.get('/me',protectRoute,getCurrentUser);
router.put('/profile',protectRoute,updateProfile);
router.put('/cart',protectRoute,updateCart);

export default router;