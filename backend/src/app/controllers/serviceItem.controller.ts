import { Request, Response } from 'express';
import {
  getServiceItemsByServiceLogIdService,
  getServiceItemByIdService,
  createServiceItemService,
  updateServiceItemService,
  deleteServiceItemService,
} from '../services/serviceItem.service';
import { responseSuccess, responseError } from '../../utils/apiResponse';

export const getServiceItemsByServiceLogId = async (req: Request, res: Response) => {
  try {
    const { serviceLogId } = req.params;
    const serviceItems = await getServiceItemsByServiceLogIdService(serviceLogId);
    responseSuccess(res, serviceItems, 'Service items retrieved successfully');
  } catch (error: any) {
    responseError(res, error.message, 404);
  }
};

export const getServiceItemById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const serviceItem = await getServiceItemByIdService(id);
    responseSuccess(res, serviceItem, 'Service item retrieved successfully');
  } catch (error: any) {
    responseError(res, error.message, 404);
  }
};

export const createServiceItem = async (req: Request, res: Response) => {
  try {
    const { serviceLogId } = req.params;
    const serviceItem = await createServiceItemService(serviceLogId, req.body);
    responseSuccess(res, serviceItem, 'Service item created successfully', 201);
  } catch (error: any) {
    responseError(res, error.message, 400);
  }
};

export const updateServiceItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const serviceItem = await updateServiceItemService(id, req.body);
    responseSuccess(res, serviceItem, 'Service item updated successfully');
  } catch (error: any) {
    responseError(res, error.message, 400);
  }
};

export const deleteServiceItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteServiceItemService(id);
    responseSuccess(res, null, 'Service item deleted successfully');
  } catch (error: any) {
    responseError(res, error.message, 404);
  }
};