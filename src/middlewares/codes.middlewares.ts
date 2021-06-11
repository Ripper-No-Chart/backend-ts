import { NextFunction, Request, Response } from 'express';
import HttpHandler from '../helpers/handler.helper';
import CodesModels, { CodesInterface } from '../models/codes.models';
import { BAD_REQUEST, INTERNAL_ERROR } from '../constants/codes.constanst';
import codeTool from '../tools/code.tools';
import moment from 'moment';

class CodesMiddleware {
  /**
   * Validate an existing code
   * @param req
   * @param res
   * @param next
   * @returns
   */
  public async validateCode(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { email, code } = req.body;
      // Check if exist: email and code, if validated is false, and expiration is lower than Date.now, and set validated in true
      const result = await CodesModels.findOneAndDelete({
        $and: [{ email }, { code }],
      });
      if (!result) {
        return HttpHandler.response(res, BAD_REQUEST, {
          response: {
            message: 'Error de validacion',
            details: 'Codigo incorrecto, tiempo de expiracion del mismo exedido o usuario inexistente',
          },
        });
      }
      req.expiresIn = '1h'; // Send expiration time 1h;
      req.email = email;
      next(); // Continue to Generate Token
    } catch (e) {
      return HttpHandler.response(res, INTERNAL_ERROR, { response: { message: e.message } });
    }
  }

  /**
   * Send random code
   * @param req
   * @param res
   * @param next
   * @returns
   */
  public async sendCode(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const email = req.body.email || req.email; // Extract email from body or token;
      // Find previous codes and check expiration
      const codeResult = await CodesModels.findOne({
        $and: [{ email }, { expiration: { $gte: new Date().getTime() } }],
      });
      if (codeResult) {
        // Prevent another request before the expiration time is reached
        return HttpHandler.response(res, BAD_REQUEST, {
          response: {
            message: 'Codigo incorrecto',
            details:
              'El usuario tiene un codigo previamente sin validar, debe esperar el tiempo de expiracion del mismo para volver a mandar otra solicitud',
          },
        });
      }
      const randomCode = codeTool.generateCode(); // generate random code;
      // save the code on mongo and set expiration time
      const code: CodesInterface = new CodesModels({
        email,
        code: randomCode,
        created: moment(), // default epoch
        expiration: moment().add(5, 'minutes'), // Expiration time in 5min,
      });
      await code.save();
      req.expiresIn = '5m';
      // SEND THE MAIL
      req.log = 'code sent';
      next();
    } catch (e) {
      return HttpHandler.response(res, INTERNAL_ERROR, { response: { message: e.message } });
    }
  }
}

export default new CodesMiddleware();
