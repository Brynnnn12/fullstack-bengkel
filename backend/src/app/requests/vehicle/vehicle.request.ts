import z from 'zod';

export const createVehicleRequestSchema = z.object({
  registrationPlate: z.string().min(1, "Plat nomor tidak boleh kosong").max(20, "Plat nomor maksimal 20 karakter"),
  make: z.string().min(1, "Merk tidak boleh kosong").max(50, "Merk maksimal 50 karakter"),
  model: z.string().min(1, "Model tidak boleh kosong").max(50, "Model maksimal 50 karakter"),
  customerId: z.string().min(1, "Customer ID diperlukan"),
});

export const updateVehicleRequestSchema = z.object({
  registrationPlate: z.string().min(1, "Plat nomor tidak boleh kosong").max(20, "Plat nomor maksimal 20 karakter").optional(),
  make: z.string().min(1, "Merk tidak boleh kosong").max(50, "Merk maksimal 50 karakter").optional(),
  model: z.string().min(1, "Model tidak boleh kosong").max(50, "Model maksimal 50 karakter").optional(),
  customerId: z.string().min(1, "Customer ID diperlukan").optional(),
});