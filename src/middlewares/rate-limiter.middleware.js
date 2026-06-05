import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
    windowMs: 0.4 * 60 * 1000, // 0.4 minute
    max: 70, // limit each IP to 4 requests per windowMs
    keyGenerator: (req)=>req.user?._id || req.ip,
    message: "Too many requests from this IP, please try 1 minute later."
});