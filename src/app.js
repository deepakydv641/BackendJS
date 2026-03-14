import express from 'express'
import cookieParser from 'cookie-parser';
import cors from 'cors';
import router from './routes/user.routes.js';

const app=express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

console.log("Registering user routes at /api/v1/users");
app.use("/api/v1/users",router)

export default app;