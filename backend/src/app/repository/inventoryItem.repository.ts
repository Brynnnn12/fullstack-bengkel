import { prisma } from '../../config/database';

export const findAllInventoryItems = async (
  offset: number,
  limit: number,
  search?: string,
  stockFilter?: 'low' | 'out' | 'available',
  sortBy?: 'name' | 'sku' | 'stock' | 'sellingPrice',
  sortOrder?: 'asc' | 'desc'
) => {
  const where: any = {};

  // Search filter
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' as const } },
      { sku: { contains: search, mode: 'insensitive' as const } },
    ];
  }

  // Stock filter
  if (stockFilter) {
    switch (stockFilter) {
      case 'low':
        where.stock = { gt: 0, lte: 10 }; // Low stock: 1-10
        break;
      case 'out':
        where.stock = { equals: 0 }; // Out of stock
        break;
      case 'available':
        where.stock = { gt: 0 }; // Available stock
        break;
    }
  }

  const orderBy = sortBy
    ? { [sortBy]: (sortOrder || 'asc') as 'asc' | 'desc' }
    : { name: 'asc' as const };

  return prisma.inventoryItem.findMany({
    where,
    skip: offset,
    take: limit,
    orderBy,
  });
};

export const countInventoryItems = async (
  search?: string,
  stockFilter?: 'low' | 'out' | 'available'
) => {
  const where: any = {};

  // Search filter
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' as const } },
      { sku: { contains: search, mode: 'insensitive' as const } },
    ];
  }

  // Stock filter
  if (stockFilter) {
    switch (stockFilter) {
      case 'low':
        where.stock = { gt: 0, lte: 10 };
        break;
      case 'out':
        where.stock = { equals: 0 };
        break;
      case 'available':
        where.stock = { gt: 0 };
        break;
    }
  }

  return prisma.inventoryItem.count({ where });
};

export const findInventoryItemById = async (id: string) => {
  return prisma.inventoryItem.findUnique({
    where: { id },
  });
};

export const findInventoryItemBySku = async (sku: string) => {
  return prisma.inventoryItem.findUnique({
    where: { sku },
  });
};

export const createInventoryItem = async (data: {
  name: string;
  sku: string;
  stock: number;
  sellingPrice: number;
}) => {
  return prisma.inventoryItem.create({
    data,
  });
};

export const updateInventoryItem = async (id: string, data: {
  name?: string;
  sku?: string;
  stock?: number;
  sellingPrice?: number;
}) => {
  return prisma.inventoryItem.update({
    where: { id },
    data,
  });
};

export const getLowStockItems = async () => {
  return prisma.inventoryItem.findMany({
    where: {
      stock: {
        gt: 0,
        lte: 10, // Low stock threshold
      },
    },
    orderBy: { stock: 'asc' },
  });
};

export const getOutOfStockItems = async () => {
  return prisma.inventoryItem.findMany({
    where: {
      stock: 0,
    },
    orderBy: { name: 'asc' },
  });
};

export const deleteInventoryItem = async (id: string) => {
  return prisma.inventoryItem.delete({
    where: { id },
  });
};