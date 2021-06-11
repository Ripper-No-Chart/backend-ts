import { NextFunction, Request, Response } from 'express';
import HttpHandler from '../helpers/handler.helper';
import UsersModel from '../models/users.models';
import bcrypt from 'bcrypt';

import { BAD_REQUEST, FORBIDDEN, INTERNAL_ERROR } from '../constants/codes.constanst';

class UsersMiddleware {
  /**
   * Verify User
   * @param req
   * @param res
   * @param next
   * @returns
   */
  public async checkCredentials(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { password } = req; // Extract password from request
      const { email } = req.body; // Extract email from body
      // Find if user exist and if allow login is true
      const user = await UsersModel.findOne({
        $and: [{ 'primary_data.email': email }, { 'permissions.allow_login': true }],
      });
      if (!user) {
        return HttpHandler.response(res, FORBIDDEN, {
          response: {
            message: 'No permitido',
            details: 'Usuario inexistente o sin permisos suficientes',
          },
        });
      }
      const hashedPassword = user?.auth_data.password; // Set hashed password
      // Compare password with hashed stored password
      const decryptPassword = bcrypt.compareSync(password!, hashedPassword!);
      // If credentials are invalid
      if (!decryptPassword || !user) {
        return HttpHandler.response(res, BAD_REQUEST, {
          response: {
            message: 'Credenciales incorrectas',
            details: 'Usuario o password incorrectos o usuario no autorizado para iniciar sesion',
          },
        });
      }
      delete req.password; // Delete req.password
      req._id = user._id; // Set _id
      req.email = email; // Set email
      req.log = 'start session'; // Set log for history
      next();
    } catch (e) {
      return HttpHandler.response(res, INTERNAL_ERROR, { response: { message: e.message } });
    }
  }

  /**
   * Check if user not exist before next
   * @param req
   * @param res
   * @param next
   * @returns
   */
  public async checkId(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { _id } = req; // Extract email from body or token;
      const userExist = await UsersModel.findById(_id); // Check if user exist
      if (!userExist) {
        return HttpHandler.response(res, FORBIDDEN, {
          response: {
            message: 'Usuario inexistente',
            details: 'El usuario no se encuentra registrado',
          },
        });
      }
      next();
    } catch (e) {
      return HttpHandler.response(res, INTERNAL_ERROR, { response: { message: e.message } });
    }
  }

  /**
   * Check user data before request new code or register new user
   * @param req
   * @param res
   * @param next
   * @returns
   */
  public async checkEmail(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { email } = req.body || req; // Extract email from body or token;
      const userExist = await UsersModel.findOne({ 'primary_data.email': email }); // Check if user exist
      if (userExist) {
        return HttpHandler.response(res, BAD_REQUEST, {
          response: {
            message: 'Usuario existente',
            details: 'El usuario ya esta registrado previamente',
          },
        });
      }
      next();
    } catch (e) {
      return HttpHandler.response(res, INTERNAL_ERROR, { response: { message: e.message } });
    }
  }
}

export default new UsersMiddleware();
