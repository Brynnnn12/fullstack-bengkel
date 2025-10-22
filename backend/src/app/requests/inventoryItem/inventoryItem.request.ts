import z from 'zod';

export const createInventoryItemRequestSchema = z.object({
  name: z.string().min(1, "Name diperlukan").max(100, "Name maksimal 100 karakter"),
  sku: z.string().min(1, "SKU diperlukan").max(50, "SKU maksimal 50 karakter"),
  stock: z.number().int().min(0, "Stock minimal 0"),
  sellingPrice: z.number().int().min(0, "Selling price minimal 0"),
});

export const updateInventoryItemRequestSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  sku: z.string().min(1).max(50).optional(),
  stock: z.number().int().min(0).optional(),
  sellingPrice: z.number().int().min(0).optional(),
});