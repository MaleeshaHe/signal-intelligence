import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { InMemorySignalStore } from '../db/InMemorySignalStore';
import { catchAsync } from '../utils/catchAsync';
import { SignalOrchestrator } from './SignalOrchestrator';

const orchestrator = new SignalOrchestrator();

export const processSignalController = catchAsync(async (req: Request, res: Response) => {
  const pipeline = orchestrator.run(req.body);

  const savedFinalOutput = InMemorySignalStore.save(pipeline.finalOutput);

  res.status(httpStatus.CREATED).json({
    message: 'Signal Processed Through Full Pipeline',
    data: {
      input: pipeline.input,
      stageOutputs: {
        registry: pipeline.registryOutput,
        classification: pipeline.classificationOutput,
        priority: pipeline.priorityOutput,
      },
      finalOutput: savedFinalOutput,
    },
  });
});
