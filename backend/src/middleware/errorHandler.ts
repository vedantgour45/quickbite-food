import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'HttpError';
  }
}

export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json({ error: 'Route not found' });
};

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  if (err instanceof ZodError) {
    const fieldErrors = err.errors.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
    }));
    res.status(400).json({ error: 'Validation failed', fieldErrors });
    return;
  }

  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }

  // express.json() rejects with a SyntaxError for malformed JSON and a
  // PayloadTooLargeError (statusCode 413) for over-limit bodies — surface those
  // directly instead of leaking 500s.
  if (err && typeof err === 'object') {
    const e = err as { type?: string; statusCode?: number; status?: number };
    if (e.statusCode === 413 || e.status === 413 || e.type === 'entity.too.large') {
      res.status(413).json({ error: 'Request body too large' });
      return;
    }
    if (err instanceof SyntaxError) {
      res.status(400).json({ error: 'Malformed JSON body' });
      return;
    }
  }

  // eslint-disable-next-line no-console
  console.error('Unexpected error:', err);
  res.status(500).json({ error: 'Internal server error' });
};
