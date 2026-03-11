import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import { router } from './routes';
import { errorMiddleware } from './middleware/error.middleware';

const app = express();

app.set('trust proxy', 1);

app.use(helmet());
app.use(compression());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'OK', service: 'signal-intelligence' });
});

app.use('/api', router);

app.use((_req, res) => {
  res.status(404).json({ status: 'NOT_FOUND', message: 'Route not found' });
});

app.use(errorMiddleware);

export default app;
