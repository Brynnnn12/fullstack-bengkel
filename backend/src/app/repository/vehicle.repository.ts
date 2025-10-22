import { prisma } from '../../config/database';

export const findAllVehicles = async (skip?: number, take?: number) => {
  return prisma.vehicle.findMany({
    skip,
    take,
    include: {
      customer: true,
      serviceLogs: true,
    },
  });
};

export const countVehicles = async () => {
  return prisma.vehicle.count();
};

export const findVehicleById = async (id: string) => {
  return prisma.vehicle.findUnique({
    where: { id },
    include: {
      customer: true,
      serviceLogs: true,
    },
  });
};

export const createVehicle = async (data: { registrationPlate: string; make: string; model: string; customerId: string }) => {
  return prisma.vehicle.create({
    data,
    include: {
      customer: true,
      serviceLogs: true,
    },
  });
};

export const updateVehicle = async (id: string, data: { registrationPlate?: string; make?: string; model?: string; customerId?: string }) => {
  return prisma.vehicle.update({
    where: { id },
    data,
    include: {
      customer: true,
      serviceLogs: true,
    },
  });
};

export const deleteVehicle = async (id: string) => {
  return prisma.vehicle.delete({
    where: { id },
  });
};