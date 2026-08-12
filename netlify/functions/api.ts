import 'dotenv/config';
import serverless from 'serverless-http';
import app from '../../src/app';

const expressHandler = serverless(app);

export const handler = async (event: any, context: any) => {
  const normalizedEvent = {
    ...event,
    path: (event?.path || '').replace(/^\/\.netlify\/functions\/api/, '/api'),
  };
  return expressHandler(normalizedEvent, context);
};
