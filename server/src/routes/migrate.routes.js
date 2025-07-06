import express from 'express';
import { runProductMigration } from '../controllers/migration.controller.js';

const router = express.Router();

router.post('/', runProductMigration);

export default router;