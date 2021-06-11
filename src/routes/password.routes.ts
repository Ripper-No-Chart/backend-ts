import { Router } from 'express';
import Token from '../auth/token/token';
import HistoryMiddleware from '../middlewares/history.middleware';
import CodesMiddlewares from '../middlewares/codes.middlewares';
import PasswordsMiddlewares from '../middlewares/passwords.middlewares';
import passwordController from '../controllers/password.controller';
const router: Router = Router();

router.post('/change');

router.post(
  '/password_request',
  Token.verifyToken, // Verify token and extract email
  CodesMiddlewares.sendCode, // Send the code and set request
  PasswordsMiddlewares.allowChange, // Set allow_password_change on true
  HistoryMiddleware.saveHistory, // Save history
  Token.generateToken // Generate token
);

router.post(
  '/change_password',
  Token.verifyToken, // Verify token and extract email
  PasswordsMiddlewares.checkAllow, // Check if change password is allowed
  PasswordsMiddlewares.passwordComplexity, // Verify password complexity and set request
  PasswordsMiddlewares.comparePassword, // Compare new password with old password
  HistoryMiddleware.saveHistory, // Save history
  passwordController.changePassword // Change password
);

export default router;
