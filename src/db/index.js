import dotenv from "dotenv";

import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";
import express from "express";

dotenv.config({path:'./.env'});
const app = express();

const ConnectDB = async()=>{
    try {
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       app.on("error",(error)=>{
        console.log("Error idhar hai: ",error)
        throw error
       })
       app.listen(process.env.PORT || 8000, () => {
        console.log('MongoDB connected successfully!!')
       })
    } catch (error) {
        console.error("Error hai:", error);
        process.exit(1);
    }
};

export default ConnectDB;