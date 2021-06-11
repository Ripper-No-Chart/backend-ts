import { Response } from 'express';

class HttpHandler {
  /**
   *
   * @param res
   * @param status
   * @param message
   * @param data
   * @returns
   */

  public response(res: Response, status: number, data = {}): Response {
    return res.status(status).json({ result: data });
  }
}
export default new HttpHandler();
