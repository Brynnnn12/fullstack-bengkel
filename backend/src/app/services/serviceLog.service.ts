import { findAllServiceLogs, countServiceLogs, findServiceLogById, createServiceLog, updateServiceLog, deleteServiceLog } from '../repository/serviceLog.repository';
import { createServiceLogRequestSchema, updateServiceLogRequestSchema } from '../requests/serviceLog/serviceLog.request';
import { getPagination, createPaginationResult, PaginationOptions } from '../../utils/pagination';
import { prisma } from '../../config/database';

export const getAllServiceLogsService = async (options: PaginationOptions = {}) => {
  const { page, limit, offset } = getPagination(options);
  const [serviceLogs, total] = await Promise.all([
    findAllServiceLogs(offset, limit),
    countServiceLogs(),
  ]);
  return createPaginationResult(serviceLogs, total, page, limit);
};

export const getServiceLogByIdService = async (id: string) => {
  const serviceLog = await findServiceLogById(id);
  if (!serviceLog) {
    throw new Error('ServiceLog not found');
  }
  return serviceLog;
};

export const createServiceLogService = async (userId: string, data: {
  date?: string;
  totalCost: number;
  notes?: string;
  vehicleId: string;
  serviceItems: Array<{
    description: string;
    quantity: number;
    price: number;
    inventoryItemId: string;
  }>;
}) => {
  const validated = createServiceLogRequestSchema.parse(data);

  // Check if user, vehicle, and inventory items exist
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  const vehicle = await prisma.vehicle.findUnique({ where: { id: validated.vehicleId } });
  if (!vehicle) throw new Error('Vehicle not found');

  for (const item of validated.serviceItems) {
    const inventoryItem = await prisma.inventoryItem.findUnique({ where: { id: item.inventoryItemId } });
    if (!inventoryItem) throw new Error(`Inventory item ${item.inventoryItemId} not found`);
    if (inventoryItem.stock < item.quantity) throw new Error(`Insufficient stock for ${inventoryItem.name}. Available: ${inventoryItem.stock}, Requested: ${item.quantity}`);
  }

  return prisma.$transaction(async (tx) => {
    // Create service log
    const serviceLog = await tx.serviceLog.create({
      data: {
        date: validated.date ? new Date(validated.date) : undefined,
        totalCost: validated.totalCost,
        notes: validated.notes,
        userId: userId,
        vehicleId: validated.vehicleId,
        serviceItems: {
          create: validated.serviceItems,
        },
      },
      include: {
        user: true,
        vehicle: {
          include: { customer: true },
        },
        serviceItems: {
          include: { inventoryItem: true },
        },
      },
    });

    // Update inventory stock
    for (const item of validated.serviceItems) {
      await tx.inventoryItem.update({
        where: { id: item.inventoryItemId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    return serviceLog;
  });
};

export const updateServiceLogService = async (id: string, data: {
  date?: string;
  totalCost?: number;
  notes?: string;
  userId?: string;
  vehicleId?: string;
  serviceItems?: Array<{
    description: string;
    quantity: number;
    price: number;
    inventoryItemId: string;
  }>;
}) => {
  const validated = updateServiceLogRequestSchema.parse(data);
  const serviceLog = await findServiceLogById(id);
  if (!serviceLog) {
    throw new Error('ServiceLog not found');
  }

  if (validated.userId) {
    const user = await prisma.user.findUnique({ where: { id: validated.userId } });
    if (!user) throw new Error('User not found');
  }

  if (validated.vehicleId) {
    const vehicle = await prisma.vehicle.findUnique({ where: { id: validated.vehicleId } });
    if (!vehicle) throw new Error('Vehicle not found');
  }

  return updateServiceLog(id, {
    ...validated,
    date: validated.date ? new Date(validated.date) : undefined,
  });
};

export const deleteServiceLogService = async (id: string) => {
  const serviceLog = await findServiceLogById(id);
  if (!serviceLog) {
    throw new Error('ServiceLog not found');
  }
  return deleteServiceLog(id);
};