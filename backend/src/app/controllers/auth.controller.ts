import { Request, Response } from 'express';
import { loginService } from '../services/auth/login.service';
import { responseSuccess, responseError } from '../../utils/apiResponse';
import { setAuthCookie } from '../../utils/authCookies';

export const login = async (req: Request, res: Response) => {
  try {
    const result = await loginService(req.body);

    // Set secure httpOnly cookie
    setAuthCookie(res, result.token);

    // Return only user name for security (no email, roles, etc.)
    const { token, ...userData } = result;
    const secureResponse = {
      name: userData.user.name // Only expose name
    };

    responseSuccess(res, secureResponse, 'Login successful');
  } catch (error: any) {
    // Use 400 for invalid credentials, 401 for token-related auth issues
    const statusCode = error.message.includes('Invalid credentials') ? 400 : 401;
    responseError(res, error.message, statusCode);
  }
};