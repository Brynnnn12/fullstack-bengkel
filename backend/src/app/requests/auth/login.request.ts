import z from 'zod';

export const loginRequestSchema = z.object({
    email: z.string().email("Email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter").max(100, "Password maksimal 100 karakter")
});