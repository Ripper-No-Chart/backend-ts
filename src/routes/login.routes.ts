import { Router } from 'express';
import UsersMiddlewares from '../middlewares/users.middlewares';
import PasswordsMiddlewares from '../middlewares/passwords.middlewares';
import HistoryMiddleware from '../middlewares/history.middleware';
import Token from '../auth/token/token';
const router: Router = Router();

router.post(
  '/',
  PasswordsMiddlewares.passwordComplexity, // Check password complexity
  UsersMiddlewares.checkCredentials, // Check credentials and set request
  HistoryMiddleware.saveHistory, // Save history
  Token.generateToken // Generate token
);

export default router;
