import express from 'express';
import { runProductMigration } from '../controllers/migrationController.js';

const router = express.Router();

router.post('/', runProductMigration);

export default router;