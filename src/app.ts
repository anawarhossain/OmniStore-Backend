import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import routes from './routes';
import { fail } from './lib/response';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.use((req: Request, res: Response) => {
  return fail(res, 'Route not found', 404);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  return fail(res, 'Internal server error', 500);
});

export default app;
