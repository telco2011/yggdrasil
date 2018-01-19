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
   * @method getHelloworld
   * @param req Request
   * @param res Response
   */
  public getHelloWorld = (req: Request, res: Response) => {
    this.logger.debug('getHelloWorld response.');

    res.status(200).json({ method: 'GET', data: 'Hello World!' });
  }

  /**
   * Posts basic 'Hello World!' json response
   *
   * @method postHelloworld
   * @param req Request
   * @param res Response
   */
  public postHelloWorld = (req: Request, res: Response) => {
    this.logger.debug('postHelloWorld response.');

    res.status(200).json({ method: 'POST', data: 'Hello World!', body: req.body });
  }

  /**
   * Puts basic 'Hello World!' json response
   *
   * @method putHelloworld
   * @param req Request
   * @param res Response
   */
  public putHelloWorld = (req: Request, res: Response) => {
    this.logger.debug('putHelloWorld response.');

    res.status(200).json({ method: 'PUT', data: 'Hello World!', body: req.body });
  }

  /**
   * Deletes basic 'Hello World!' json response
   *
   * @method deleteHelloworld
   * @param req Request
   * @param res Response
   */
  public deleteHelloWorld = (req: Request, res: Response) => {
    this.logger.debug('deleteHelloWorld response.');

    res.status(200).json({ method: 'DELETE', data: 'Hello World!', body: req.body });
  }
}
