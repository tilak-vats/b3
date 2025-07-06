// utils/connectDb.js
import mongoose from 'mongoose';

const connectDb = async () => {
    try {
        // Ensure that process.env.MONGODB_URI is correctly set in your .env file
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host} ✅`);
    } catch (error) {
        console.error(`Error: ${error.message} ❌`);
        // Exit process with failure
        process.exit(1);
    }
};

export default connectDb;