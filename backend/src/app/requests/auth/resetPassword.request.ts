import z from "zod";

export const resetPasswordRequestSchema = z.object({
    token: z.string().min(1, "Token diperlukan"),
    newPassword: z.string().min(6, "Password baru minimal 6 karakter").max(100, "Password baru maksimal 100 karakter")
});