import { findAllInventoryItems, countInventoryItems, findInventoryItemById, findInventoryItemBySku, createInventoryItem, updateInventoryItem, deleteInventoryItem, getLowStockItems, getOutOfStockItems } from '../repository/inventoryItem.repository';
import { createInventoryItemRequestSchema, updateInventoryItemRequestSchema } from '../requests/inventoryItem/inventoryItem.request';
import { getPagination, createPaginationResult, PaginationOptions } from '../../utils/pagination';

export const getAllInventoryItemsService = async (options: PaginationOptions & {
  search?: string;
  stockFilter?: 'low' | 'out' | 'available';
  sortBy?: 'name' | 'sku' | 'stock' | 'sellingPrice';
  sortOrder?: 'asc' | 'desc';
} = {}) => {
  const { page, limit, offset } = getPagination(options);
  const [inventoryItems, total] = await Promise.all([
    findAllInventoryItems(offset, limit, options.search, options.stockFilter, options.sortBy, options.sortOrder),
    countInventoryItems(options.search, options.stockFilter),
  ]);
  return createPaginationResult(inventoryItems, total, page, limit);
};

export const getInventoryItemByIdService = async (id: string) => {
  const inventoryItem = await findInventoryItemById(id);
  if (!inventoryItem) {
    throw new Error('Inventory item not found');
  }
  return inventoryItem;
};

export const createInventoryItemService = async (data: {
  name: string;
  sku: string;
  stock: number;
  sellingPrice: number;
}) => {
  const validated = createInventoryItemRequestSchema.parse(data);

  // Check if SKU already exists
  const existingItem = await findInventoryItemBySku(validated.sku);
  if (existingItem) {
    throw new Error('SKU already exists');
  }

  return createInventoryItem(validated);
};

export const updateInventoryItemService = async (id: string, data: {
  name?: string;
  sku?: string;
  stock?: number;
  sellingPrice?: number;
}) => {
  const validated = updateInventoryItemRequestSchema.parse(data);
  const inventoryItem = await findInventoryItemById(id);
  if (!inventoryItem) {
    throw new Error('Inventory item not found');
  }

  // Check if SKU is being updated and already exists
  if (validated.sku && validated.sku !== inventoryItem.sku) {
    const existingItem = await findInventoryItemBySku(validated.sku);
    if (existingItem) {
      throw new Error('SKU already exists');
    }
  }

  return updateInventoryItem(id, validated);
};

export const getLowStockItemsService = async () => {
  return getLowStockItems();
};

export const getOutOfStockItemsService = async () => {
  return getOutOfStockItems();
};

export const deleteInventoryItemService = async (id: string) => {
  const inventoryItem = await findInventoryItemById(id);
  if (!inventoryItem) {
    throw new Error('Inventory item not found');
  }

  return deleteInventoryItem(id);
};