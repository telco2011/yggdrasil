import { Request, Response } from '../../../mvc';
import { FileLogger } from '../../../core';

export class DefaultCtrl {

  /** BasicCtrl logger */
  private logger: FileLogger;

  /** Default constructor */
  constructor() {
    this.logger = new FileLogger(DefaultCtrl.name);
  }

  public getDefault = (req: Request, res: Response) => {
    this.logger.debug('getDefault response.');

    const helloWorld = 'Hello World!';

    if (req.is('application/json')) {
      this.logger.debug('Is JSON request');
      res.json({ data: helloWorld });
    } else {
      this.logger.debug(`Not JSON request => ${req.get('content-type')}`);
      res.send(helloWorld);
    }
  }

}
