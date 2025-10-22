import { prisma } from '../../../config/database';

export const findAllCustomers = async (skip?: number, take?: number) => {
  return prisma.customer.findMany({
    skip,
    take,
    include: {
      vehicles: true,
    },
  });
};

export const countCustomers = async () => {
  return prisma.customer.count();
};

export const findCustomerById = async (id: string) => {
  return prisma.customer.findUnique({
    where: { id },
    include: {
      vehicles: true,
    },
  });
};

export const createCustomer = async (data: { name: string; phoneNumber: string }) => {
  return prisma.customer.create({
    data,
    include: {
      vehicles: true,
    },
  });
};

export const updateCustomer = async (id: string, data: { name?: string; phoneNumber?: string }) => {
  return prisma.customer.update({
    where: { id },
    data,
    include: {
      vehicles: true,
    },
  });
};

export const deleteCustomer = async (id: string) => {
  return prisma.customer.delete({
    where: { id },
  });
};