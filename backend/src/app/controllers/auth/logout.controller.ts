import { Request, Response } from 'express';
import { responseSuccess } from '../../../utils/apiResponse';
import { clearAuthCookie } from '../../../utils/authCookies';

export const logout = async (req: Request, res: Response) => {
  try {
    // Clear the httpOnly cookie
    clearAuthCookie(res);

    responseSuccess(res, null, 'Logout successful');
  } catch (error: any) {
    // Even if clearing cookie fails, we still want to respond
    responseSuccess(res, null, 'Logout successful');
  }
};