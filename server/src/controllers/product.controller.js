import Product from '../models/products.model.js';
import asyncHandler from 'express-async-handler';

export const getAllProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find({}); 

        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products found." });
        }

        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Server error while fetching products." });
    }
});