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

export const categorizeProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find({});
        console.log('starting categorising')
        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products found to categorize." });
        }

        const categories = {
            'snacks': ['chips', 'biscuit', 'cookie', 'namkeen', 'mixture', 'crackers', 'wafer', 'puff'],
            'beverages': ['juice', 'drink', 'tea', 'coffee', 'water', 'soda', 'cola', 'beer', 'wine', 'milk'],
            'kitchenware': ['plate', 'bowl', 'spoon', 'fork', 'knife', 'pan', 'pot', 'utensil', 'container'],
            'daily essentials': ['soap', 'shampoo', 'toothpaste', 'brush', 'tissue', 'toilet', 'detergent', 'oil'],
            'pooja': ['incense', 'agarbatti', 'diya', 'camphor', 'kumkum', 'haldi', 'prayer', 'temple'],
            'dry fruits': ['almond', 'cashew', 'walnut', 'raisin', 'date', 'fig', 'pistachio', 'nuts'],
            'spices': ['turmeric', 'chili', 'cumin', 'coriander', 'pepper', 'cardamom', 'cinnamon', 'clove', 'masala'],
            'chocolates': ['chocolate', 'cocoa', 'candy', 'bar', 'truffle'],
            'sweets': ['laddu', 'barfi', 'halwa', 'gulab jamun', 'rasgulla', 'sweet', 'mithai', 'jalebi']
        };

        let updatedCount = 0;

        for (const product of products) {
            const productName = product.name.toLowerCase();
            let newCategory = 'uncategorised';

            // Find matching category
            for (const [category, keywords] of Object.entries(categories)) {
                if (keywords.some(keyword => productName.includes(keyword))) {
                    newCategory = category;
                    console.log('done');
                    break;
                }
            }

            // Update product if category changed
            if (product.category !== newCategory) {
                await Product.findByIdAndUpdate(product._id, { 
                    category: newCategory,
                    updatedAt: new Date()
                });
                updatedCount++;
            }
        }
        console.log('done')
        res.status(200).json({ 
            message: `Successfully categorized ${updatedCount} products`,
            totalProducts: products.length,
            updatedProducts: updatedCount
        });

    } catch (error) {
        console.error("Error categorizing products:", error);
        res.status(500).json({ error: "Server error while categorizing products." });
    }
});