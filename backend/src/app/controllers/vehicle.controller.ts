import { Request, Response } from 'express';
import {
  getAllVehiclesService,
  getVehicleByIdService,
  createVehicleService,
  updateVehicleService,
  deleteVehicleService,
} from '../services/vehicle.service';
import { responseSuccess, responseError } from '../../utils/apiResponse';

export const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await getAllVehiclesService({ page, limit });
    responseSuccess(res, result.data, 'Vehicles retrieved successfully', 200, result.pagination);
  } catch (error: any) {
    responseError(res, error.message, 500);
  }
};

export const getVehicleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const vehicle = await getVehicleByIdService(id);
    responseSuccess(res, vehicle, 'Vehicle retrieved successfully');
  } catch (error: any) {
    responseError(res, error.message, 404);
  }
};

export const createVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await createVehicleService(req.body);
    responseSuccess(res, vehicle, 'Vehicle created successfully', 201);
  } catch (error: any) {
    responseError(res, error.message, 400);
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const vehicle = await updateVehicleService(id, req.body);
    responseSuccess(res, vehicle, 'Vehicle updated successfully');
  } catch (error: any) {
    responseError(res, error.message, 400);
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteVehicleService(id);
    responseSuccess(res, null, 'Vehicle deleted successfully');
  } catch (error: any) {
    responseError(res, error.message, 404);
  }
};