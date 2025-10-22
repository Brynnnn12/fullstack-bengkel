import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

export interface CustomJwtPayload extends JwtPayload {
  id: string;
  email: string;
  roles?: string[];
}

export const generateToken = (
  payload: CustomJwtPayload,
  secret: string,
  expiresIn: string = '1h'
): string => {
  const options: SignOptions = { expiresIn: expiresIn as any };
  return jwt.sign(payload, secret, options);
};

export const verifyToken = (token: string, secret: string): CustomJwtPayload => {
  try {
    const decoded = jwt.verify(token, secret) as CustomJwtPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};