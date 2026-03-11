import express, { Request, Response, Router } from 'express';
import { InMemorySignalStore } from '../db/InMemorySignalStore';
import { SignalRegistryRoute } from '../modules/SignalRegistry/SignalRegistryRoute';
import { SignalClassificationRoute } from '../modules/SignalClassification/SignalClassificationRoute';
import { SignalPriorityEngineRoute } from '../modules/SignalPriorityEngine/SignalPriorityEngineRoute';

export const router = express.Router();

interface RouteConfig {
  path: string;
  route?: Router;
  children?: RouteConfig[];
}

const defaultRoutes: RouteConfig[] = [
  {
    path: '/signals',
    children: [
      {
        path: '/register',
        route: SignalRegistryRoute,
      },
      {
        path: '/classify',
        route: SignalClassificationRoute,
      },
      {
        path: '/prioritize',
        route: SignalPriorityEngineRoute,
      },
    ],
  },
];

defaultRoutes.forEach((route) => {
  if (route.children && route.children.length > 0) {
    route.children.forEach((child) => {
      if (child.route) {
        router.use(`${route.path}${child.path}`, child.route);
      }
    });
  } else if (route.route) {
    router.use(route.path, route.route);
  }
});

router.get('/signals', (_req: Request, res: Response) => {
  res.status(200).json(InMemorySignalStore.findAll());
});

router.get('/signals/:id', (req: Request, res: Response) => {
  const id = String(req.params.id);
  const record = InMemorySignalStore.findById(id);
  if (!record) {
    res.status(404).json({ message: 'Signal not found' });
    return;
  }
  res.status(200).json(record);
});

