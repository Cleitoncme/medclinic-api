import { Router } from 'express';

import { UserController } from '../controllers/user.controller';

const authRoutes = Router();
const userController = new UserController();

authRoutes.post('/register', userController.register);

export { authRoutes };
