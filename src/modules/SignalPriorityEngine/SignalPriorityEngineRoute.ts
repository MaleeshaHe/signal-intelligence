import express from 'express';
import * as controllers from './SignalPriorityEngineController';

export const SignalPriorityEngineRoute = express.Router();

SignalPriorityEngineRoute
  .route('/')
  .post(controllers.prioritizeSignalController);
