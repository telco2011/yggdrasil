/** yggdrasil imports */
import { BaseRoutes, Router } from '@yggdrasil/mvc';
import { FileLogger } from '@yggdrasil/logger';

/** Application controllers imports */
import { BasicCtrl } from '../../controllers/basic.ctrl';

/**
 * @class BasicAPIRoute
 */
export class BasicAPIRoute extends BaseRoutes {

  /** BasicAPIRoute logger */
  logger: FileLogger;

  /** Declare controllers */
  private basicCtrl: BasicCtrl;

  /** Default constructor */
  constructor(router: Router) {
    super();
    this.logger = new FileLogger(BasicAPIRoute.name);
    this.basicCtrl = new BasicCtrl();

    /** Creates routes */
    this.create(router);
  }

  /**
   * Creates routes.
   *
   * @class BasicAPIRoute
   * @method create
   */
  create(router: Router) {
    this.logger.debug('Creating BasicRoutes routes.');

    /** GETS */
    this.gets(router);
  }

  /** Creates GETS API */
  private gets(router: Router) {
    router.route('/basic').get(this.basicCtrl.helloWorld);
  }

}
