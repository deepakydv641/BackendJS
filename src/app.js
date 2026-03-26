import express from 'express'
import cookieParser from 'cookie-parser';
import cors from 'cors';
import router from './routes/user.routes.js';
import router1 from './routes/videos.routes.js';
import router2 from './routes/subscription.routes.js';
import router3 from './routes/comment.routes.js';
import router4 from './routes/tweet.routes.js';
import router5 from './routes/search.routes.js';
import router6 from './routes/like.routes.js';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN === "*" ? true : process.env.CORS_ORIGIN || true,
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

console.log("Registering user routes at /api/v1/users");
app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});
app.use("/api/v1/users", router)
app.use("/api/v1/videos", router1)
app.use("/api/v1/subscriptions", router2)
app.use("/api/v1/comments", router3)
app.use("/api/v1/tweets", router4)
app.use("/api/v1/search", router5)
app.use("/api/v1/likes", router6)

// Global error handler — catches errors thrown by asyncHandler
app.use((err, req, res, next) => {
    console.error("Error occurred:", err);
    console.error("Stack trace:", err.stack);

    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        errors: err.errors || []
    });
});

export default app;