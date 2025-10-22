import { Request, Response } from 'express';
import {
  getAllServiceLogsService,
  getServiceLogByIdService,
  createServiceLogService,
  updateServiceLogService,
  deleteServiceLogService,
} from '../services/serviceLog.service';
import { responseSuccess, responseError } from '../../utils/apiResponse';

export const getAllServiceLogs = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await getAllServiceLogsService({ page, limit });
    responseSuccess(res, result.data, 'ServiceLogs retrieved successfully', 200, result.pagination);
  } catch (error: any) {
    responseError(res, error.message, 500);
  }
};

export const getServiceLogById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const serviceLog = await getServiceLogByIdService(id);
    responseSuccess(res, serviceLog, 'ServiceLog retrieved successfully');
  } catch (error: any) {
    responseError(res, error.message, 404);
  }
};

export const createServiceLog = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id; // From JWT
    const serviceLog = await createServiceLogService(userId, req.body);
    responseSuccess(res, serviceLog, 'ServiceLog created successfully', 201);
  } catch (error: any) {
    responseError(res, error.message, 400);
  }
};

export const updateServiceLog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const serviceLog = await updateServiceLogService(id, req.body);
    responseSuccess(res, serviceLog, 'ServiceLog updated successfully');
  } catch (error: any) {
    responseError(res, error.message, 400);
  }
};

export const deleteServiceLog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteServiceLogService(id);
    responseSuccess(res, null, 'ServiceLog deleted successfully');
  } catch (error: any) {
    responseError(res, error.message, 404);
  }
};