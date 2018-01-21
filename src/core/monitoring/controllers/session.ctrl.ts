import { Request, Response } from '../../../mvc';
import { FileLogger } from '../../../core';
import { SessionHandler } from '../../../security';

export class MonitorSessionCtrl {

  /** BasicCtrl logger */
  private logger: FileLogger;

  /** SessionHandler from principal app */
  private session: SessionHandler;

  /** Default constructor */
  constructor(session: SessionHandler) {
    this.logger = new FileLogger(MonitorSessionCtrl.name);
    this.session = session;
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

    res.send(this.session.getSessionStore(req));
  }

}
