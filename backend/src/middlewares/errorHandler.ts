import { Request, Response, NextFunction } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Keep console.error for visibility; in production, consider a logger
  // eslint-disable-next-line no-console
  console.error(err);
  const status: number = err?.status || 500;
  res.status(status).json({ message: err?.message || 'Internal Server Error' });
};

export default errorHandler;
