import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import path from 'node:path';
import menuRoutes from './routes/menu.routes';
import orderRoutes from './routes/order.routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const isTest = process.env.NODE_ENV === 'test';

const corsErrorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (err instanceof Error && err.message.startsWith('CORS:')) {
    res.status(403).json({ error: err.message });
    return;
  }
  next(err);
};

export const createApp = (): Application => {
  const app = express();

  app.use(
    helmet({
      // SSE responses are streamed and not cross-origin embedded — default settings are fine.
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      // Allow the Vercel frontend to <img> our menu pictures.
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  const allowedOrigin = process.env.ALLOWED_ORIGIN ?? 'http://localhost:5173';
  const allowedOrigins = allowedOrigin.split(',').map((o) => o.trim());

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
          return callback(null, true);
        }
        return callback(new Error(`CORS: origin ${origin} not allowed`));
      },
      credentials: true,
    }),
  );
  app.use(corsErrorHandler);

  app.use(express.json({ limit: '50kb' }));

  // Rate limit: 200 req/min per IP across the whole API in production.
  // POST /api/orders gets a tighter 30/min — placing dozens of orders/sec is suspicious.
  if (!isTest) {
    const apiLimiter = rateLimit({
      windowMs: 60_000,
      max: 200,
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: 'Too many requests. Please slow down.' },
    });
    const placeOrderLimiter = rateLimit({
      windowMs: 60_000,
      max: 30,
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: 'Too many orders. Please slow down.' },
    });

    app.use('/api', apiLimiter);
    app.use('/api/orders', (req, res, next) =>
      req.method === 'POST' ? placeOrderLimiter(req, res, next) : next(),
    );
  }

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  // Static menu photos. __dirname resolves to backend/src in dev (tsx) and
  // backend/dist in prod (node) — both have ../public/menu next to them.
  // fallthrough left at default true so a missing file lands on the
  // notFoundHandler below and returns a consistent 404 JSON envelope.
  app.use(
    '/static/menu',
    express.static(path.join(__dirname, '../public/menu'), {
      maxAge: '7d',
      immutable: true,
    }),
  );

  app.use('/api/menu', menuRoutes);
  app.use('/api/orders', orderRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
