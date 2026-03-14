import dotenv from "dotenv";
// this file has the code for how backend is connected to MongoDB by connection String 
import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";
import express from "express";
import app from "../app.js";

dotenv.config({path:'./.env'});

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