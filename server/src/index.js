import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/products.route.js";
import orderRoutes from "./routes/order.routes.js";
import {clerkMiddleware} from '@clerk/express';
import connectDb from './utils/connectDb.js';

const app = express();
dotenv.config();

(async () => {
    try {
        await connectDb(); 
        console.log('Database connected successfully.');

        app.use(cors());
        app.use(express.json());
        app.use(clerkMiddleware());

        // Routes
        app.use('/api/users', userRoutes);
        app.use('/api/products', productRoutes);
        app.use('/api/orders', orderRoutes);

        app.get('/', (req, res) => {
            res.send('Hello from Server !! 🎉');
        });

        app.listen(process.env.PORT, () => {
            console.log(`Server is starting on port ${process.env.PORT} ✅`);
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1); 
    }
})();