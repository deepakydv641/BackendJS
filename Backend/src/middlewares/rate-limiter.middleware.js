import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
    windowMs: 0.4 * 60 * 1000, // 0.4 minute
    max: 20000, // limit each IP to 20000 requests per windowMs
    message: "Too many requests from this IP, please try 1 minute later.",
    validate: { xForwardedForHeader: false }
});