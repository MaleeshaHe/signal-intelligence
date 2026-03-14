import express from 'express';
import { processSignalController } from './SignalOrchestratorController';

export const SignalOrchestratorRoute = express.Router();

SignalOrchestratorRoute.route('/').post(processSignalController);
