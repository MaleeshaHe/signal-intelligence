import express from 'express';
import * as controllers from './SignalClassificationController';

export const SignalClassificationRoute = express.Router();

SignalClassificationRoute
  .route('/')
  .post(controllers.classifySignalController);
