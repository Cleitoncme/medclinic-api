import { Router } from 'express';

import { UserController } from '../controllers/user.controller';
import { AuthController } from '../controllers/auth.controller';

const authRoutes = Router();
const userController = new UserController();
const authController = new AuthController();

authRoutes.post('/register', userController.register);
authRoutes.post('/login', authController.login);

export { authRoutes };
