/** yggdrasil imports */
import { Request, Response } from '@yggdrasil/mvc';
import { FileLogger } from '@yggdrasil/core';

/**
 * @class BasicCtrl
 */
export class BasicCtrl {

  /** BasicCtrl logger */
  private logger: FileLogger;

  /** Default constructor */
  constructor() {
    this.logger = new FileLogger(BasicCtrl.name);
  }

  /**
   * Gets basic 'Hello World!' json response
   *
   * @method helloworld
   * @param req Request
   * @param res Response
   */
  public helloWorld = (req: Request, res: Response) => {
    this.logger.debug('Hello World response.');

    res.status(200).json({ data: 'Hello World!' });
  }
}
