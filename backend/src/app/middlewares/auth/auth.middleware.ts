import { Request, Response, NextFunction } from 'express';
import { verifyToken, CustomJwtPayload } from '../../../config/jwt';
import { getAuthTokenFromCookie } from '../../../utils/authCookies';

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: CustomJwtPayload;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Try to get token from cookie first (more secure), then from header
    let token = getAuthTokenFromCookie(req);

    if (!token) {
      // Fallback to Authorization header
      const authHeader = req.headers['authorization'];
      token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const decoded = verifyToken(token, process.env.JWT_SECRET!);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

