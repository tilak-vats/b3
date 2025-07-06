// controllers/migrationController.js
import asyncHandler from 'express-async-handler';
import Product from '../models/products.model.js'; 
import { migrateProductsData } from '../utils/migrateProducts.js';

export const runProductMigration = asyncHandler(async (req, res) => {

  try {
    console.log("Migration API route hit. Starting product migration...");
    const result = await migrateProductsData(Product); 

    if (result.success) {
      res.status(200).json({
        message: result.message,
        migratedCount: result.migratedCount,
        failedCount: result.failedCount,
        duplicateCount: result.duplicateCount
      });
    } else {
      res.status(500).json({
        error: result.message,
        migratedCount: result.migratedCount,
        failedCount: result.failedCount,
        duplicateCount: result.duplicateCount
      });
    }
  } catch (error) {
    console.error("Unhandled error in migration API:", error);
    res.status(500).json({ error: "An unexpected server error occurred during migration." });
  }
});