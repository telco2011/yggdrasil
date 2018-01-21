import { Request, Response } from '../../../mvc';
import { FileLogger } from '../../../core';

export class MonitorSessionCtrl {

  /** BasicCtrl logger */
  private logger: FileLogger;

  /** Default constructor */
  constructor() {
    this.logger = new FileLogger(MonitorSessionCtrl.name);
  }

  /**
   * Session store object
   *
   * @method getSession
   * @param req Request
   * @param res Response
   */
  public getSession = (req: Request, res: Response) => {
    this.logger.debug('getSession response.');

    res.send(req.session.getSessionStore(req));
  }

}
