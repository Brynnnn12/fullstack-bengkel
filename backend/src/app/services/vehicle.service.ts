import { prisma } from '../../config/database';
import { findAllVehicles, countVehicles, findVehicleById, createVehicle, updateVehicle, deleteVehicle } from '../repository/vehicle.repository';
import { createVehicleRequestSchema, updateVehicleRequestSchema } from '../requests/vehicle/vehicle.request';
import { getPagination, createPaginationResult, PaginationOptions } from '../../utils/pagination';

export const getAllVehiclesService = async (options: PaginationOptions = {}) => {
  const { page, limit, offset } = getPagination(options);
  const [vehicles, total] = await Promise.all([
    findAllVehicles(offset, limit),
    countVehicles(),
  ]);
  return createPaginationResult(vehicles, total, page, limit);
};

export const getVehicleByIdService = async (id: string) => {
  const vehicle = await findVehicleById(id);
  if (!vehicle) {
    throw new Error('Vehicle not found');
  }
  return vehicle;
};

export const createVehicleService = async (data: { registrationPlate: string; make: string; model: string; customerId: string }) => {
  const validated = createVehicleRequestSchema.parse(data);
  // Check if customer exists
  const customer = await prisma.customer.findUnique({ where: { id: validated.customerId } });
  if (!customer) {
    throw new Error('Customer not found');
  }
  return createVehicle(validated);
};

export const updateVehicleService = async (id: string, data: { registrationPlate?: string; make?: string; model?: string; customerId?: string }) => {
  const validated = updateVehicleRequestSchema.parse(data);
  const vehicle = await findVehicleById(id);
  if (!vehicle) {
    throw new Error('Vehicle not found');
  }
  if (validated.customerId) {
    const customer = await prisma.customer.findUnique({ where: { id: validated.customerId } });
    if (!customer) {
      throw new Error('Customer not found');
    }
  }
  return updateVehicle(id, validated);
};

export const deleteVehicleService = async (id: string) => {
  const vehicle = await findVehicleById(id);
  if (!vehicle) {
    throw new Error('Vehicle not found');
  }
  return deleteVehicle(id);
};