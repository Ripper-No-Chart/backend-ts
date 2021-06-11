import { Router } from 'express';
import Token from '../auth/token/token';
import CodesMiddleware from '../middlewares/codes.middlewares';
const router: Router = Router();

router.post(
  '/validate',
  Token.verifyToken, // Verify token
  CodesMiddleware.validateCode, // Validate sent code
  Token.generateToken // Generate token
);

export default router;
