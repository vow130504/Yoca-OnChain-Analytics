import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Wrap async route handlers to forward errors to next()
 */
export default function asyncHandler<T extends RequestHandler>(fn: T): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
