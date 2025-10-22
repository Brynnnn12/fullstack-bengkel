import { Request, Response, NextFunction } from 'express';
import { verifyToken, CustomJwtPayload } from '../../../config/jwt';
import { responseError } from '../../../utils/apiResponse';

declare global {
  namespace Express {
    interface Request {
      user?: CustomJwtPayload;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return responseError(res, 'Access token required', 401);
  }

  try {
    const decoded = verifyToken(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    return responseError(res, 'Invalid or expired token', 403);
  }
};  