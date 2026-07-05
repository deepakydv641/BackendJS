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
import downloadRouter from './routes/download.routes.js';
import { rateLimiter } from './middlewares/rate-limiter.middleware.js';

const app = express();

// Trust proxy for nginx reverse proxy
// app.set('trust proxy', true);


const port = process.env.PORT || 8000;
app.use(cors({
    origin:true,
    credentials:true
}))


app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())
app.use("/api/v1",rateLimiter)  // used for all routes under /api/v1  to avoid to count the images requests it was doing before
app.use("/api/v1/users", router)
app.use("/api/v1/videos", router1)
app.use("/api/v1/subscriptions", router2)
app.use("/api/v1/comments", router3)
app.use("/api/v1/tweets", router4)
app.use("/api/v1/search", router5)
app.use("/api/v1/likes", router6)
app.use("/api/v1/download", downloadRouter)

// Global error handler — catches errors thrown by asyncHandler
app.use((err, req, res, next) => {
    console.log('error in global error handler:', err.message);

    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        errors: err.errors || []
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get("/",(req,res)=>{
    // Perform a CPU-intensive task
    // let sum = 0;
    // for (let i = 0; i < 100000000; i++) {
    //     sum += i;
    // }
    // console.log(`${port} is serving requests`);
    res.status(200).json({ message: `${port} is serving requests` });
})

export default app;