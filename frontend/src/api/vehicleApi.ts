import api from '@/lib/axios';
import { z } from 'zod';

// Vehicle types
export interface Vehicle {
  id: string;
  registrationPlate: string;
  make: string;
  model: string;
  customerId: string;
  customer?: {
    id: string;
    name: string;
    phoneNumber: string;
  };
  serviceLogs?: {
    id: string;
    date: string;
    totalCost: number;
    notes?: string;
  }[];
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
const createVehicleSchema = z.object({
  registrationPlate: z.string().min(1, 'Registration plate is required'),
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  customerId: z.string().min(1, 'Customer is required'),
});

const updateVehicleSchema = z.object({
  registrationPlate: z.string().min(1, 'Registration plate is required').optional(),
  make: z.string().min(1, 'Make is required').optional(),
  model: z.string().min(1, 'Model is required').optional(),
  customerId: z.string().min(1, 'Customer is required').optional(),
});

export { createVehicleSchema, updateVehicleSchema };

export type CreateVehicleData = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleData = z.infer<typeof updateVehicleSchema>;

export const vehicleApi = {
  // Get all vehicles with pagination
  getAllVehicles: async (params?: { page?: number; limit?: number }) => {
    const response = await api.get<ApiResponse<Vehicle[]>>('/vehicles', { params });
    return response.data;
  },

  // Get vehicle by ID
  getVehicleById: async (id: string) => {
    const response = await api.get<ApiResponse<Vehicle>>(`/vehicles/${id}`);
    return response.data;
  },

  // Create new vehicle
  createVehicle: async (data: CreateVehicleData) => {
    const validated = createVehicleSchema.parse(data);
    const response = await api.post<ApiResponse<Vehicle>>('/vehicles', validated);
    return response.data;
  },

  // Update vehicle
  updateVehicle: async (id: string, data: UpdateVehicleData) => {
    const validated = updateVehicleSchema.parse(data);
    const response = await api.put<ApiResponse<Vehicle>>(`/vehicles/${id}`, validated);
    return response.data;
  },

  // Delete vehicle
  deleteVehicle: async (id: string) => {
    const response = await api.delete<ApiResponse<void>>(`/vehicles/${id}`);
    return response.data;
  },
};