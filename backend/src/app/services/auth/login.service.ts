import bcrypt from 'bcryptjs';
import { generateToken } from '../../../config/jwt';
import { findUserByEmail } from '../../repository/auth/auth.repository';
import { loginRequestSchema } from '../../requests/auth/login.request';

export const loginService = async (loginData: { email: string; password: string }) => {
  const validated = loginRequestSchema.parse(loginData);
  const { email, password } = validated;

  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }

  const roles = user.userRoles.map((ur: { role: { name: string } }) => ur.role.name);
  const token = generateToken(
    { id: user.id, email: user.email, roles },
    process.env.JWT_SECRET!
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      roles,
    },
  };
};