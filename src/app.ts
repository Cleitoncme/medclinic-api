import express from 'express';

import { adminRoutes } from './routes/admin.routes';
import { authRoutes } from './routes/auth.routes';
import { userRoutes } from './routes/user.routes';
import { errorHandler, notFoundHandler } from './middlewares/error-handler.middleware';

const app = express();

app.use(express.json());
app.get('/health', (_request, response) => {
  return response.status(200).json({ status: 'ok' });
});
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/admin', adminRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export { app };
