import z from 'zod';

export const createCustomerRequestSchema = z.object({
  name: z.string().min(1, "Nama tidak boleh kosong").max(100, "Nama maksimal 100 karakter"),
  phoneNumber: z.string().min(10, "Nomor telepon minimal 10 digit").max(15, "Nomor telepon maksimal 15 digit"),
});

export const updateCustomerRequestSchema = z.object({
  name: z.string().min(1, "Nama tidak boleh kosong").max(100, "Nama maksimal 100 karakter").optional(),
  phoneNumber: z.string().min(10, "Nomor telepon minimal 10 digit").max(15, "Nomor telepon maksimal 15 digit").optional(),
});