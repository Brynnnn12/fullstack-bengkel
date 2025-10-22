import { Request, Response } from 'express';
import {
  getAllCustomersService,
  getCustomerByIdService,
  createCustomerService,
  updateCustomerService,
  deleteCustomerService,
} from '../services/customer.service';
import { responseSuccess, responseError } from '../../utils/apiResponse';

export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await getAllCustomersService({ page, limit });
    responseSuccess(res, result.data, 'Customers retrieved successfully', 200, result.pagination);
  } catch (error: any) {
    responseError(res, error.message, 500);
  }
};

export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const customer = await getCustomerByIdService(id);
    responseSuccess(res, customer, 'Customer retrieved successfully');
  } catch (error: any) {
    responseError(res, error.message, 404);
  }
};

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const customer = await createCustomerService(req.body);
    responseSuccess(res, customer, 'Customer created successfully', 201);
  } catch (error: any) {
    responseError(res, error.message, 400);
  }
};

export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const customer = await updateCustomerService(id, req.body);
    responseSuccess(res, customer, 'Customer updated successfully');
  } catch (error: any) {
    responseError(res, error.message, 400);
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteCustomerService(id);
    responseSuccess(res, null, 'Customer deleted successfully');
  } catch (error: any) {
    responseError(res, error.message, 404);
  }
};