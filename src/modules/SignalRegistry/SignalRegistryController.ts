import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { InMemorySignalStore } from '../../db/InMemorySignalStore';
import * as Service from './SignalRegistryService';

const service = new Service.SignalRegistryService();

export const registerSignalController = catchAsync(async (req: Request, res: Response) => {
  const output = service.process(req.body);
  const saved = InMemorySignalStore.save(output);

  res.status(httpStatus.CREATED).json({
    message: 'Signal Registered Successfully',
    data: saved,
  });
});
