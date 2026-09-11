import express from 'express';

import { adminRoutes } from './routes/admin.routes';
import { authRoutes } from './routes/auth.routes';
import { userRoutes } from './routes/user.routes';

const app = express();

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/admin', adminRoutes);

app.get('/health', (_request, response) => {
  return response.status(200).json({ status: 'ok' });
});

export { app };
