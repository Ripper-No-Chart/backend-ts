import { Request, Response, NextFunction } from 'express';
import HttpHandler from '../helpers/handler.helper';
import HistoryModels from '../models/history.models';
import { INTERNAL_ERROR } from '../constants/codes.constanst';

class HistoryMiddleware {
  /**
   * Login
   * @param req
   * @param res
   * @param next
   * @returns
   */
  public async saveHistory(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { email, log } = req; // Extract email and log
      const historySession = new HistoryModels({
        email,
        log,
      });
      await historySession.save(); // Save new log in history
      next(); // next to generate token
    } catch (e) {
      return HttpHandler.response(res, INTERNAL_ERROR, { response: { message: e.message } });
    }
  }
}

export default new HistoryMiddleware();
