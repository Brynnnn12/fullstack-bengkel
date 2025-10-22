import { prisma } from '../../config/database';

export const findAllServiceLogs = async (skip?: number, take?: number) => {
  return prisma.serviceLog.findMany({
    skip,
    take,
    include: {
      user: true,
      vehicle: {
        include: { customer: true },
      },
      serviceItems: {
        include: { inventoryItem: true },
      },
    },
    orderBy: { date: 'desc' },
  });
};

export const countServiceLogs = async () => {
  return prisma.serviceLog.count();
};

export const findServiceLogById = async (id: string) => {
  return prisma.serviceLog.findUnique({
    where: { id },
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
};

export const createServiceLog = async (data: {
  date?: Date;
  totalCost: number;
  notes?: string;
  userId: string;
  vehicleId: string;
  serviceItems: Array<{
    description: string;
    quantity: number;
    price: number;
    inventoryItemId: string;
  }>;
}) => {
  return prisma.serviceLog.create({
    data: {
      date: data.date,
      totalCost: data.totalCost,
      notes: data.notes,
      userId: data.userId,
      vehicleId: data.vehicleId,
      serviceItems: {
        create: data.serviceItems,
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
};

export const updateServiceLog = async (id: string, data: {
  date?: Date;
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
  // For simplicity, update basic fields; for serviceItems, might need separate handling
  return prisma.serviceLog.update({
    where: { id },
    data: {
      date: data.date,
      totalCost: data.totalCost,
      notes: data.notes,
      userId: data.userId,
      vehicleId: data.vehicleId,
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
};

export const deleteServiceLog = async (id: string) => {
  return prisma.serviceLog.delete({
    where: { id },
  });
};