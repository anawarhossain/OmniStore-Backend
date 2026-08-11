import { Response } from 'express';

export const success = <T>(
  res: Response,
  message: string,
  data: T | null = null,
  statusCode = 200
) => {
  return res.status(statusCode).json({ success: true, message, data });
};

export const fail = (
  res: Response,
  message: string,
  statusCode = 400,
  data: unknown = null
) => {
  return res.status(statusCode).json({ success: false, message, data });
};
