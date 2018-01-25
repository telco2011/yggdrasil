/** yggdrasil imports */
import { BaseRoutes, Router } from '@yggdrasil/mvc';
import { FileLogger } from '@yggdrasil/core';

/** Application controllers imports */
import { HomeCtrl } from '../controllers/routes';

/**
 * @class HomeRoute
 */
export class HomeRoute extends BaseRoutes {

  /** HomeCtrl logger */
  public logger: FileLogger;

  /** HomeCtrl Ctrl */
  private homeCtrl: HomeCtrl;

  /** Default constructor */
  constructor(router: Router) {
    super();
    this.logger = new FileLogger(HomeRoute.name);
    this.homeCtrl = new HomeCtrl();

    /** Creates routes */
    this.create(router);
  }

  /**
   * Creates routes.
   *
   * @class HomeCtrl
   * @method create
   */
  public create(router: Router) {
    this.logger.debug('Creating HomeCtrl routes.');

    router.route('/home').get(this.homeCtrl.home);
    router.route('/contact').get(this.homeCtrl.contact);
  }

}
