import z from 'zod';

export const createServiceLogRequestSchema = z.object({
  date: z.string().datetime().optional(), // ISO string
  totalCost: z.number().int().min(0, "Total cost minimal 0"),
  notes: z.string().max(500, "Notes maksimal 500 karakter").optional(),
  vehicleId: z.string().min(1, "Vehicle ID diperlukan"),
  serviceItems: z.array(z.object({
    description: z.string().min(1, "Description diperlukan"),
    quantity: z.number().int().min(1, "Quantity minimal 1"),
    price: z.number().int().min(0, "Price minimal 0"),
    inventoryItemId: z.string().min(1, "Inventory Item ID diperlukan"),
  })).min(1, "Minimal 1 service item"),
});

export const updateServiceLogRequestSchema = z.object({
  date: z.string().datetime().optional(),
  totalCost: z.number().int().min(0).optional(),
  notes: z.string().max(500).optional(),
  userId: z.string().min(1).optional(),
  vehicleId: z.string().min(1).optional(),
  serviceItems: z.array(z.object({
    description: z.string().min(1),
    quantity: z.number().int().min(1),
    price: z.number().int().min(0),
    inventoryItemId: z.string().min(1),
  })).optional(),
});