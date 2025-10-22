import { Request, Response, NextFunction } from 'express';
import { responseError } from '../../../utils/apiResponse';


export const notFound = (req: Request, res: Response, next: NextFunction) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    responseError(res, error.message, 404);
    next(error);

};

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
        res.status(statusCode).json({
            status: "error",
            message: err.message,
            stack: process.env.NODE_ENV === 'production' ? null : err.stack,
        });
};