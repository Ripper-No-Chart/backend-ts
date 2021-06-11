import { Request, Response } from 'express';
import UsersModel from '../models/users.models';
import HttpHandler from '../helpers/handler.helper';
import { SUCCESS, INTERNAL_ERROR } from '../constants/codes.constanst';

class PasswordController {
  /**
   * Change password
   * @param req
   * @param res
   * @returns
   */
  public async changePassword(req: Request, res: Response): Promise<Response> {
    try {
      const { _id, password } = req;
      await UsersModel.findByIdAndUpdate({ _id }, { $set: { 'auth_data.password': password } });
      return HttpHandler.response(res, SUCCESS, { response: { message: 'El password se cambio con exito', _id } });
    } catch (e) {
      return HttpHandler.response(res, INTERNAL_ERROR, { response: { message: e.message } });
    }
  }
}

export default new PasswordController();
