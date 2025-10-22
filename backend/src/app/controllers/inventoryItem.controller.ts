import { Request, Response } from 'express';
import {
  getAllInventoryItemsService,
  getInventoryItemByIdService,
  createInventoryItemService,
  updateInventoryItemService,
  deleteInventoryItemService,
  getLowStockItemsService,
  getOutOfStockItemsService,
} from '../services/inventoryItem.service';
import { responseSuccess, responseError } from '../../utils/apiResponse';

export const getAllInventoryItems = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const stockFilter = req.query.stockFilter as 'low' | 'out' | 'available';
    const sortBy = req.query.sortBy as 'name' | 'sku' | 'stock' | 'sellingPrice';
    const sortOrder = req.query.sortOrder as 'asc' | 'desc';

    const result = await getAllInventoryItemsService({
      page,
      limit,
      search,
      stockFilter,
      sortBy,
      sortOrder
    });
    responseSuccess(res, result.data, 'Inventory items retrieved successfully', 200, result.pagination);
  } catch (error: any) {
    responseError(res, error.message, 500);
  }
};

export const getInventoryItemById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const inventoryItem = await getInventoryItemByIdService(id);
    responseSuccess(res, inventoryItem, 'Inventory item retrieved successfully');
  } catch (error: any) {
    responseError(res, error.message, 404);
  }
};

export const createInventoryItem = async (req: Request, res: Response) => {
  try {
    const inventoryItem = await createInventoryItemService(req.body);
    responseSuccess(res, inventoryItem, 'Inventory item created successfully', 201);
  } catch (error: any) {
    responseError(res, error.message, 400);
  }
};

export const updateInventoryItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const inventoryItem = await updateInventoryItemService(id, req.body);
    responseSuccess(res, inventoryItem, 'Inventory item updated successfully');
  } catch (error: any) {
    responseError(res, error.message, 400);
  }
};

export const getLowStockItems = async (req: Request, res: Response) => {
  try {
    const items = await getLowStockItemsService();
    responseSuccess(res, items, 'Low stock items retrieved successfully');
  } catch (error: any) {
    responseError(res, error.message, 500);
  }
};

export const getOutOfStockItems = async (req: Request, res: Response) => {
  try {
    const items = await getOutOfStockItemsService();
    responseSuccess(res, items, 'Out of stock items retrieved successfully');
  } catch (error: any) {
    responseError(res, error.message, 500);
  }
};

export const deleteInventoryItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteInventoryItemService(id);
    responseSuccess(res, null, 'Inventory item deleted successfully');
  } catch (error: any) {
    responseError(res, error.message, 404);
  }
};