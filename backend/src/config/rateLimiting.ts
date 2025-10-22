import rateLimit from "express-rate-limit";
import { Request } from "express";

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        status: "error",
        message: "Terlalu banyak permintaan dari IP ini, silakan coba lagi nanti."
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Stricter rate limiting for auth endpoints
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 login attempts per windowMs
    message: {
        status: "error",
        message: "Terlalu banyak percobaan login, silakan coba lagi dalam 15 menit."
    },
    standardHeaders: true,
    legacyHeaders: false,
});