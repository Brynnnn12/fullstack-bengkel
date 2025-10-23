import api from '@/lib/axios';
import { z } from 'zod';

// Inventory Item types
export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  stock: number;
  sellingPrice: number;
}

// API response types
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Request schemas
const createInventoryItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  sku: z.string().min(1, 'SKU is required'),
  stock: z.number().min(0, 'Stock must be non-negative'),
  sellingPrice: z.number().min(0, 'Selling price must be non-negative'),
});

const updateInventoryItemSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  sku: z.string().min(1, 'SKU is required').optional(),
  stock: z.number().min(0, 'Stock must be non-negative').optional(),
  sellingPrice: z.number().min(0, 'Selling price must be non-negative').optional(),
});

export type CreateInventoryItemData = z.infer<typeof createInventoryItemSchema>;
export type UpdateInventoryItemData = z.infer<typeof updateInventoryItemSchema>;

export { createInventoryItemSchema, updateInventoryItemSchema };

export const inventoryApi = {
  // Get all inventory items with pagination
  getAllInventoryItems: async (params?: { page?: number; limit?: number }) => {
    const response = await api.get<ApiResponse<InventoryItem[]>>('/inventory', { params });
    return response.data;
  },

  // Get inventory item by ID
  getInventoryItemById: async (id: string) => {
    const response = await api.get<ApiResponse<InventoryItem>>(`/inventory/${id}`);
    return response.data;
  },

  // Create new inventory item
  createInventoryItem: async (data: CreateInventoryItemData) => {
    const validated = createInventoryItemSchema.parse(data);
    const response = await api.post<ApiResponse<InventoryItem>>('/inventory', validated);
    return response.data;
  },

  // Update inventory item
  updateInventoryItem: async (id: string, data: UpdateInventoryItemData) => {
    const validated = updateInventoryItemSchema.parse(data);
    const response = await api.put<ApiResponse<InventoryItem>>(`/inventory/${id}`, validated);
    return response.data;
  },

  // Delete inventory item
  deleteInventoryItem: async (id: string) => {
    const response = await api.delete<ApiResponse<void>>(`/inventory/${id}`);
    return response.data;
  },
};