import { Response } from 'express';

// Cookie utilities for secure token storage
export const setAuthCookie = (res: Response, token: string) => {
  res.cookie('auth_token', token, {
    httpOnly: true, // Prevents XSS attacks
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'strict', // CSRF protection
    maxAge: 60 * 60 * 1000, // 1 hour
    path: '/',
  });
};

export const clearAuthCookie = (res: Response) => {
  res.clearCookie('auth_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });
};

export const getAuthTokenFromCookie = (req: any): string | null => {
  return req.cookies?.auth_token || null;
};