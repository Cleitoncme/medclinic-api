import { Router } from 'express';

import { AdminController } from '../controllers/admin.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import { UserRole } from '../entities/user.entity';

const adminRoutes = Router();
const adminController = new AdminController();

adminRoutes.get('/ping', authenticate, authorize(UserRole.ADMIN), adminController.ping);

export { adminRoutes };
