// utils/migrateProducts.js
import mongoose from 'mongoose';

const OldProductSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  retailPrice: { type: Number, required: true },
  wholesalePrice: { type: Number, required: true },
  barcode: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

let oldDbConnection;

const connectToOldDb = async () => {
  if (oldDbConnection && oldDbConnection.readyState === 1) {
    console.log("Already connected to old database.");
    return oldDbConnection;
  }
  try {
    oldDbConnection = await mongoose.createConnection(process.env.MONGODB_OLD_URI);
    console.log("Connected to old database successfully!");
    return oldDbConnection;
  } catch (error) {
    console.error("Error connecting to old database:", error.message);
    throw new Error("Failed to connect to old database.");
  }
};

const disconnectFromOldDb = async () => {
  if (oldDbConnection && oldDbConnection.readyState === 1) {
    await oldDbConnection.close();
    console.log("Disconnected from old database.");
    oldDbConnection = null;
  }
};

export const migrateProductsData = async (NewProductModel) => {
  let migratedCount = 0;
  let failedCount = 0;
  let duplicateCount = 0;

  try {
    const oldDb = await connectToOldDb();
    const OldProduct = oldDb.model('Product', OldProductSchema); // Get model from old connection

    console.log("Fetching products from old database...");
    const oldProducts = await OldProduct.find({});
    console.log(`Found ${oldProducts.length} products in the old database.`);

    if (oldProducts.length === 0) {
      return {
        success: true,
        message: "No products found in the old database to migrate.",
        migratedCount: 0,
        failedCount: 0,
        duplicateCount: 0
      };
    }

    const newProductsToInsert = oldProducts.map(oldProduct => ({
      name: oldProduct.name,
      category: oldProduct.category,
      quantity: oldProduct.quantity,
      image: "", // New field, defaulting to empty string
      price: oldProduct.retailPrice, // Using retailPrice for the new 'price' field
      barcode: oldProduct.barcode,
      createdAt: oldProduct.createdAt,
      updatedAt: oldProduct.updatedAt
    }));

    console.log("Attempting to insert transformed products into new database...");

    const result = await NewProductModel.insertMany(newProductsToInsert, { ordered: false });
    migratedCount = result.insertedCount;
    console.log(`Successfully migrated ${migratedCount} products.`);

  } catch (error) {
    console.error("Error during product migration:", error);

    if (error.code === 11000) { 
      console.warn("Duplicate barcode detected during migration. Some products might have been skipped.");
      if (error.writeErrors) {
        duplicateCount = error.writeErrors.filter(err => err.code === 11000).length;
        failedCount = error.writeErrors.length - duplicateCount; // Other errors
        migratedCount = newProductsToInsert.length - error.writeErrors.length;
      }
      return {
        success: false,
        message: `Migration completed with some errors. ${migratedCount} products migrated, ${duplicateCount} duplicates skipped, ${failedCount} others failed.`,
        migratedCount,
        failedCount,
        duplicateCount
      };
    } else if (error.name === 'ValidationError') {
      console.error("Validation Error during migration:", error.message);
      return {
        success: false,
        message: "Validation error during migration. Check schema compatibility.",
        migratedCount: 0,
        failedCount: newProductsToInsert.length,
        duplicateCount: 0
      };
    }

    return {
      success: false,
      message: "An unexpected error occurred during migration.",
      migratedCount,
      failedCount: newProductsToInsert.length - migratedCount,
      duplicateCount
    };
  } finally {
    await disconnectFromOldDb();
  }

  return {
    success: true,
    message: `Product migration completed successfully. ${migratedCount} products migrated.`,
    migratedCount,
    failedCount,
    duplicateCount
  };
};