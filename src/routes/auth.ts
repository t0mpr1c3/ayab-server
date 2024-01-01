import { Router } from 'express';

import { checkJwt } from '../middlewares/checkJwt';
import AuthController from '../controllers/authController';

const router = Router();

// Login
router.post('/login', AuthController.login);

// Change password
router.post('/change-password', [checkJwt], AuthController.changePassword);

export default router;
