import { findAllCustomers, countCustomers, findCustomerById, createCustomer, updateCustomer, deleteCustomer } from '../repository/customers/customer.repository';
import { createCustomerRequestSchema, updateCustomerRequestSchema } from '../requests/customer/customer.request';
import { getPagination, createPaginationResult, PaginationOptions } from '../../utils/pagination';

export const getAllCustomersService = async (options: PaginationOptions = {}) => {
  const { page, limit, offset } = getPagination(options);
  const [customers, total] = await Promise.all([
    findAllCustomers(offset, limit),
    countCustomers(),
  ]);
  return createPaginationResult(customers, total, page, limit);
};

export const getCustomerByIdService = async (id: string) => {
  const customer = await findCustomerById(id);
  if (!customer) {
    throw new Error('Customer not found');
  }
  return customer;
};

export const createCustomerService = async (data: { name: string; phoneNumber: string }) => {
  const validated = createCustomerRequestSchema.parse(data);
  return createCustomer(validated);
};

export const updateCustomerService = async (id: string, data: { name?: string; phoneNumber?: string }) => {
  const validated = updateCustomerRequestSchema.parse(data);
  const customer = await findCustomerById(id);
  if (!customer) {
    throw new Error('Customer not found');
  }
  return updateCustomer(id, validated);
};

export const deleteCustomerService = async (id: string) => {
  const customer = await findCustomerById(id);
  if (!customer) {
    throw new Error('Customer not found');
  }
  return deleteCustomer(id);
};