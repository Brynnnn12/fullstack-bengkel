import z from 'zod';

export const createServiceItemRequestSchema = z.object({
  description: z.string().min(1, "Description diperlukan").max(500, "Description maksimal 500 karakter"),
  quantity: z.number().int().min(1, "Quantity minimal 1"),
  price: z.number().int().min(0, "Price minimal 0"),
  inventoryItemId: z.string().min(1, "Inventory Item ID diperlukan"),
});

export const updateServiceItemRequestSchema = z.object({
  description: z.string().min(1).max(500).optional(),
  quantity: z.number().int().min(1).optional(),
  price: z.number().int().min(0).optional(),
  inventoryItemId: z.string().min(1).optional(),
});