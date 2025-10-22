import { Response } from 'express';

export const responseSuccess = (
  res: Response,
  data: any,
  message: string = 'Success',
  status: number = 200,
  pagination?: any
) => {
  const response: any = {
    success: true,
    message,
    data,
  };
  if (pagination) {
    response.pagination = pagination;
  }
  res.status(status).json(response);
};

export const responseError = (
  res: Response,
  message: string,
  status: number = 500
) => {
  res.status(status).json({
    success: false,
    message,
  });
};