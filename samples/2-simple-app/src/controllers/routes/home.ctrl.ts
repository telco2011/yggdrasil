/** yggdrasil imports */
import { Request, Response } from '@yggdrasil/mvc';
import { FileLogger } from '@yggdrasil/core';

/**
 * @class HomeCtrl
 */
export class HomeCtrl {

  /** HomeCtrl logger */
  private logger: FileLogger;

  /** Default constructor */
  constructor() {
    this.logger = new FileLogger(HomeCtrl.name);
  }

  /**
   * Render Home page
   *
   * @method home
   * @param req Request
   * @param res Response
   */
  public home = (req: Request, res: Response) => {
    this.logger.debug('go to home.');

    res.render('home', { title: 'Home' });
  }

  /**
   * Render Contact page
   *
   * @method contact
   * @param req Request
   * @param res Response
   */
  public contact = (req: Request, res: Response) => {
    this.logger.debug('go to contact.');

    res.render('contact', { title: 'Contact' });
  }

}
