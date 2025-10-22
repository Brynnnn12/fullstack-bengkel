import api from '@/lib/axios';
import { z } from 'zod';

// Customer types
export interface Customer {
  id: string;
  name: string;
  phoneNumber: string;
  vehicles?: {
    id: string;
    registrationPlate: string;
    make: string;
    model: string;
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
export const createCustomerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
});

export const updateCustomerSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  phoneNumber: z.string().min(1, 'Phone number is required').optional(),
});

export type CreateCustomerData = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerData = z.infer<typeof updateCustomerSchema>;

// API functions
export const customerApi = {
  // Get all customers with pagination
  getAllCustomers: async (params?: { page?: number; limit?: number }) => {
    const response = await api.get<ApiResponse<Customer[]>>('/customers', { params });
    return response.data;
  },

  // Get customer by ID
  getCustomerById: async (id: string) => {
    const response = await api.get<ApiResponse<Customer>>(`/customers/${id}`);
    return response.data;
  },

  // Create new customer
  createCustomer: async (data: CreateCustomerData) => {
    const response = await api.post<ApiResponse<Customer>>('/customers', data);
    return response.data;
  },

  // Update customer
  updateCustomer: async (id: string, data: UpdateCustomerData) => {
    const response = await api.put<ApiResponse<Customer>>(`/customers/${id}`, data);
    return response.data;
  },

  // Delete customer
  deleteCustomer: async (id: string) => {
    const response = await api.delete<ApiResponse<null>>(`/customers/${id}`);
    return response.data;
  },
};