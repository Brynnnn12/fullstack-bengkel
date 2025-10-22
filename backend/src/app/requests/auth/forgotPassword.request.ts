import z from 'zod';

export const forgotPasswordRequestSchema = z.object({
    email: z.string().email("Email tidak valid")
});