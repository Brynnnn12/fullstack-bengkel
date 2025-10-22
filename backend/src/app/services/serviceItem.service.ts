import { findServiceItemsByServiceLogId, findServiceItemById, createServiceItem, updateServiceItem, deleteServiceItem, updateServiceItemStock } from '../repository/serviceItem.repository';
import { createServiceItemRequestSchema, updateServiceItemRequestSchema } from '../requests/serviceItem/serviceItem.request';
import { prisma } from '../../config/database';

export const getServiceItemsByServiceLogIdService = async (serviceLogId: string) => {
  // Verify service log exists
  const serviceLog = await prisma.serviceLog.findUnique({
    where: { id: serviceLogId },
  });
  if (!serviceLog) {
    throw new Error('Service log not found');
  }

  return findServiceItemsByServiceLogId(serviceLogId);
};

export const getServiceItemByIdService = async (id: string) => {
  const serviceItem = await findServiceItemById(id);
  if (!serviceItem) {
    throw new Error('Service item not found');
  }
  return serviceItem;
};

export const createServiceItemService = async (serviceLogId: string, data: {
  description: string;
  quantity: number;
  price: number;
  inventoryItemId: string;
}) => {
  const validated = createServiceItemRequestSchema.parse(data);

  // Verify service log exists
  const serviceLog = await prisma.serviceLog.findUnique({
    where: { id: serviceLogId },
  });
  if (!serviceLog) {
    throw new Error('Service log not found');
  }

  // Verify inventory item exists and has sufficient stock
  const inventoryItem = await prisma.inventoryItem.findUnique({
    where: { id: validated.inventoryItemId },
  });
  if (!inventoryItem) {
    throw new Error('Inventory item not found');
  }
  if (inventoryItem.stock < validated.quantity) {
    throw new Error(`Insufficient stock for ${inventoryItem.name}. Available: ${inventoryItem.stock}, Requested: ${validated.quantity}`);
  }

  return prisma.$transaction(async (tx) => {
    // Create service item
    const serviceItem = await tx.serviceItem.create({
      data: {
        ...validated,
        serviceLogId,
      },
      include: {
        inventoryItem: true,
      },
    });

    // Update inventory stock
    await tx.inventoryItem.update({
      where: { id: validated.inventoryItemId },
      data: {
        stock: {
          decrement: validated.quantity,
        },
      },
    });

    return serviceItem;
  });
};

export const updateServiceItemService = async (id: string, data: {
  description?: string;
  quantity?: number;
  price?: number;
  inventoryItemId?: string;
}) => {
  const validated = updateServiceItemRequestSchema.parse(data);
  const serviceItem = await findServiceItemById(id);
  if (!serviceItem) {
    throw new Error('Service item not found');
  }

  // If quantity is being updated, handle stock adjustment
  if (validated.quantity !== undefined && validated.quantity !== serviceItem.quantity) {
    return updateServiceItemStock(id, validated.quantity);
  }

  // If inventory item is being changed, verify new item exists and has stock
  if (validated.inventoryItemId && validated.inventoryItemId !== serviceItem.inventoryItemId) {
    const newInventoryItem = await prisma.inventoryItem.findUnique({
      where: { id: validated.inventoryItemId },
    });
    if (!newInventoryItem) {
      throw new Error('New inventory item not found');
    }
    if (newInventoryItem.stock < serviceItem.quantity) {
      throw new Error(`Insufficient stock for ${newInventoryItem.name}. Available: ${newInventoryItem.stock}, Required: ${serviceItem.quantity}`);
    }
  }

  return updateServiceItem(id, validated);
};

export const deleteServiceItemService = async (id: string) => {
  const serviceItem = await findServiceItemById(id);
  if (!serviceItem) {
    throw new Error('Service item not found');
  }

  return prisma.$transaction(async (tx) => {
    // Return stock to inventory
    await tx.inventoryItem.update({
      where: { id: serviceItem.inventoryItemId },
      data: {
        stock: {
          increment: serviceItem.quantity,
        },
      },
    });

    // Delete service item
    return tx.serviceItem.delete({
      where: { id },
    });
  });
};