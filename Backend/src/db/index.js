// This file only connects to MongoDB — server startup is handled in src/index.js
import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const ConnectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    } catch (error) {
        console.log('error in ConnectDB:', error.message);
        process.exit(1);
    }
};

export default ConnectDB;