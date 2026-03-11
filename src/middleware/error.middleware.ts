import { Request, Response, NextFunction } from 'express';

export function errorMiddleware(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(`[ERROR] ${error.message}`);
  res.status(500).json({
    status: 'ERROR',
    message: error.message || 'Internal server error',
  });
}
