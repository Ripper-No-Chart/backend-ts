import { Router } from 'express';
import UserControllers from '../controllers/user.controllers';
import Token from '../auth/token/token';
import UserMiddlewares from '../middlewares/users.middlewares';
import PasswordsMiddlewares from '../middlewares/passwords.middlewares';
import CodesMiddlewares from '../middlewares/codes.middlewares';
const router: Router = Router();

router.post(
  '/register_request',
  UserMiddlewares.checkEmail, // Check email not exist
  CodesMiddlewares.sendCode, // Send the request
  Token.generateToken // Generate token
);

router.post(
  '/register_user',
  Token.verifyToken, // Verify token and set email
  UserMiddlewares.checkEmail, // Check user not exist
  PasswordsMiddlewares.passwordComplexity, // Check password complexity
  UserControllers.registerUser // Register new user
);

router.post(
  '/edit_user',
  Token.verifyToken, // Verify token and set id
  UserMiddlewares.checkId, // Check user exist
  UserControllers.editUser // Edit an existing user
);

router.post(
  '/get_user',
  Token.verifyToken, // Verify token
  UserMiddlewares.checkId, // Check user exist
  UserControllers.getUser // Get user data
);

export default router;
