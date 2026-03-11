import express from 'express';
import * as controllers from './SignalRegistryController';

export const SignalRegistryRoute = express.Router();

SignalRegistryRoute
  .route('/')
  .post(controllers.registerSignalController);
