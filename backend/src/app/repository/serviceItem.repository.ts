import { prisma } from '../../config/database';

export const findServiceItemsByServiceLogId = async (serviceLogId: string) => {
  return prisma.serviceItem.findMany({
    where: { serviceLogId },
    include: {
      inventoryItem: true,
    },
    orderBy: { inventoryItem: { name: 'asc' } },
  });
};

export const findServiceItemById = async (id: string) => {
  return prisma.serviceItem.findUnique({
    where: { id },
    include: {
      inventoryItem: true,
      serviceLog: true,
    },
  });
};

export const createServiceItem = async (data: {
  description: string;
  quantity: number;
  price: number;
  serviceLogId: string;
  inventoryItemId: string;
}) => {
  return prisma.serviceItem.create({
    data,
    include: {
      inventoryItem: true,
    },
  });
};

export const updateServiceItem = async (id: string, data: {
  description?: string;
  quantity?: number;
  price?: number;
  inventoryItemId?: string;
}) => {
  return prisma.serviceItem.update({
    where: { id },
    data,
    include: {
      inventoryItem: true,
    },
  });
};

export const deleteServiceItem = async (id: string) => {
  return prisma.serviceItem.delete({
    where: { id },
  });
};

export const updateServiceItemStock = async (serviceItemId: string, newQuantity: number) => {
  const serviceItem = await prisma.serviceItem.findUnique({
    where: { id: serviceItemId },
    include: { inventoryItem: true },
  });

  if (!serviceItem) {
    throw new Error('Service item not found');
  }

  const quantityDifference = newQuantity - serviceItem.quantity;

  // Check if there's enough stock for increase
  if (quantityDifference > 0 && serviceItem.inventoryItem.stock < quantityDifference) {
    throw new Error(`Insufficient stock. Available: ${serviceItem.inventoryItem.stock}, Requested: ${quantityDifference}`);
  }

  return prisma.$transaction(async (tx) => {
    // Update service item quantity
    const updatedServiceItem = await tx.serviceItem.update({
      where: { id: serviceItemId },
      data: { quantity: newQuantity },
      include: { inventoryItem: true },
    });

    // Update inventory stock
    await tx.inventoryItem.update({
      where: { id: serviceItem.inventoryItemId },
      data: {
        stock: {
          [quantityDifference > 0 ? 'decrement' : 'increment']: Math.abs(quantityDifference),
        },
      },
    });

    return updatedServiceItem;
  });
};