import { Request, Response, NextFunction } from 'express';
import { responseError } from '../../../utils/apiResponse';
import type { CustomJwtPayload } from '../../../config/jwt';

declare global {
  namespace Express {
    interface Request {
      user?: CustomJwtPayload;
    }
  }
}

export const checkRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.roles) {
      return responseError(res, 'User roles not found', 403);
    }

    const hasRole = req.user.roles.some((role) => allowedRoles.includes(role));
    if (!hasRole) {
      return responseError(res, 'Insufficient permissions', 403);
    }

    next();
  };
};
