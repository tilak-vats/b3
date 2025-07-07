import express from 'express';
import { sendSMS } from '../controllers/message.controller';

const router = express.Router()

router.get("/", sendSMS);

export default router