import api from '@/lib/axios';
import { z } from 'zod';

// Service Log types
export interface ServiceLog {
  id: string;
  date: string;
  totalCost: number;
  notes?: string;
  userId: string;
  vehicleId: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  vehicle?: {
    id: string;
    registrationPlate: string;
    make: string;
    model: string;
    customer?: {
      id: string;
      name: string;
      phoneNumber: string;
    };
  };
  serviceItems?: ServiceItem[];
}

export interface ServiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  serviceLogId: string;
  inventoryItemId: string;
  inventoryItem?: {
    id: string;
    name: string;
    unit: string;
    price: number;
  };
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
const serviceItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  price: z.number().min(0, 'Price must be non-negative'),
  inventoryItemId: z.string().min(1, 'Inventory item is required'),
});

const createServiceLogSchema = z.object({
  date: z.string().optional(),
  totalCost: z.number().min(0, 'Total cost must be non-negative'),
  notes: z.string().optional(),
  vehicleId: z.string().min(1, 'Vehicle is required'),
  serviceItems: z.array(serviceItemSchema).min(1, 'At least one service item is required'),
});

const updateServiceLogSchema = z.object({
  date: z.string().optional(),
  totalCost: z.number().min(0, 'Total cost must be non-negative').optional(),
  notes: z.string().optional(),
  vehicleId: z.string().min(1, 'Vehicle is required').optional(),
  serviceItems: z.array(serviceItemSchema).optional(),
});

export type CreateServiceLogData = z.infer<typeof createServiceLogSchema>;
export type UpdateServiceLogData = z.infer<typeof updateServiceLogSchema>;
export type ServiceItemData = z.infer<typeof serviceItemSchema>;

export { createServiceLogSchema, updateServiceLogSchema, serviceItemSchema };

export const serviceLogApi = {
  // Get all service logs with pagination
  getAllServiceLogs: async (params?: { page?: number; limit?: number }) => {
    const response = await api.get<ApiResponse<ServiceLog[]>>('/service-logs', { params });
    return response.data;
  },

  // Get service log by ID
  getServiceLogById: async (id: string) => {
    const response = await api.get<ApiResponse<ServiceLog>>(`/service-logs/${id}`);
    return response.data;
  },

  // Create new service log
  createServiceLog: async (data: CreateServiceLogData) => {
    const validated = createServiceLogSchema.parse(data);
    const response = await api.post<ApiResponse<ServiceLog>>('/service-logs', validated);
    return response.data;
  },

  // Update service log
  updateServiceLog: async (id: string, data: UpdateServiceLogData) => {
    const validated = updateServiceLogSchema.parse(data);
    const response = await api.put<ApiResponse<ServiceLog>>(`/service-logs/${id}`, validated);
    return response.data;
  },

  // Delete service log
  deleteServiceLog: async (id: string) => {
    const response = await api.delete<ApiResponse<void>>(`/service-logs/${id}`);
    return response.data;
  },
};