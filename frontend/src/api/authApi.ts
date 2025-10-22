import apiClient from '../lib/axios';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginRequest = z.infer<typeof loginSchema>;

export interface LoginResponse {
  name: string; // Only return name for security
}

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const validatedData = loginSchema.parse(data);
    const response = await apiClient.post('/auth/login', validatedData);
    return response.data.data; // Token is now in httpOnly cookie
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },
};
