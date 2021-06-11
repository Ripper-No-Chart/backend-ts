import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import PasswordTool from '../tools/password.tools';
import HttpHandler from '../helpers/handler.helper';
import UsersModels from '../models/users.models';
import { BAD_REQUEST, INTERNAL_ERROR, SUCCESS } from '../constants/codes.constanst';

class PasswordsMiddleware {
  /**
   * Check password complexity
   * @param req
   * @param res
   * @param next
   * @returns
   */
  public async passwordComplexity(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { password } = req.body.auth_data || req.body; // Extract password
      // Check password complexity
      if (!PasswordTool.validatePassword(password)) {
        return HttpHandler.response(res, BAD_REQUEST, {
          response: {
            message: 'Password incorrecto',
            details:
              'Formato incorrecto. (Mínimo 8 caracteres, mayúsculas, minúsculas, al menos 2 numeros y no debe contener espacios en blanco)',
          },
        });
      }
      req.password = password; // Set password
      next();
    } catch (e) {
      return HttpHandler.response(res, INTERNAL_ERROR, { response: { message: e.message } });
    }
  }

  /**
   * Compare new password with stored password
   * @param req
   * @param res
   * @param next
   * @returns
   */
  public async comparePassword(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { _id } = req; // Extract _id from token
      const { password } = req.body; // Extract new password from body
      const oldPassword = await UsersModels.findById({ _id }).then((user) => {
        return user?.auth_data.password; // Find old user password
      });
      const samePassword = bcrypt.compareSync(password, oldPassword!); // Compare old password with new password
      if (samePassword) {
        // If is the same password return error
        return HttpHandler.response(res, BAD_REQUEST, {
          response: {
            message: 'Error de password',
            details: 'El password ingresado es incorrecto',
          },
        });
      }
      const hashedPassword = await bcrypt.hash(password!, 10); // Hash and set the password in auth_data
      req.password = hashedPassword; // Set on request the new password
      req.log = 'password change';
      next();
    } catch (e) {
      return HttpHandler.response(res, INTERNAL_ERROR, { response: { message: e.message } });
    }
  }

  /**
   * Set allow password change on true
   * @param req
   * @param res
   * @param next
   * @returns
   */
  public async allowChange(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { _id } = req; // Extract _id from token
      await UsersModels.findByIdAndUpdate({ _id }, { $set: { 'permissions.allow_password_change': true } });
      next();
    } catch (e) {
      return HttpHandler.response(res, INTERNAL_ERROR, { response: { message: e.message } });
    }
  }

  /**
   * checkPasswordChangeAviability
   */
  public async checkAllow(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { _id } = req; // Extract _id from token
      const user = await UsersModels.findOneAndUpdate(
        { $and: [{ _id }, { 'permissions.allow_password_change': true }] },
        { $set: { 'permissions.allow_password_change': false } }
      ); // Check if user is allowed to change password and set false
      if (!user) {
        // If user is not allowed
        return HttpHandler.response(res, BAD_REQUEST, {
          response: {
            message: 'Error de permisos',
            details: 'El usuario no puede cambiar el password',
          },
        });
      }
      next();
    } catch (e) {
      return HttpHandler.response(res, INTERNAL_ERROR, { response: { message: e.message } });
    }
  }
}

export default new PasswordsMiddleware();
