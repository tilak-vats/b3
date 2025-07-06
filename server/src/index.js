import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/products.route.js";
import {clerkMiddleware} from '@clerk/express';

const app = express();
dotenv.config()

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

//Routes
app.use('/api/users',userRoutes);
app.use('/api/products',productRoutes);


app.get('/',(req,res)=>{
    res.send('Hello from Server !! 🎉')
})

app.listen(process.env.PORT,()=>{
    console.log(`Server is starting on port ${process.env.PORT} ✅`)
})