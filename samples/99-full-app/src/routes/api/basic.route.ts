/** yggdrasil imports */
import { BaseRoutes, Router } from '@yggdrasil/mvc';
import { FileLogger } from '@yggdrasil/core';

/** Application controllers imports */
import { BasicCtrl } from '../../controllers/api';

/**
 * @class BasicAPIRoute
 */
export class BasicAPIRoute extends BaseRoutes {

  /** BasicAPIRoute logger */
  public logger: FileLogger;

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
  public create(router: Router) {
    this.logger.debug('Creating BasicRoutes routes.');

    /** GETS */
    this.gets(router);

    /** POSTS */
    this.posts(router);

    /** PUT */
    this.puts(router);

    /** DELETE */
    this.deletes(router);
  }

  /** Creates GETS API */
  private gets(router: Router) {
    this.logger.debug('Configuring gets.');

    router.route('/basic').get(this.basicCtrl.getHelloWorld);
  }

  /** Creates POSTS API */
  private posts(router: Router) {
    this.logger.debug('Configuring posts.');

    router.route('/basic').post(this.basicCtrl.postHelloWorld);
  }

  /** Creates PUTS API */
  private puts(router: Router) {
    this.logger.debug('Configuring puts.');

    router.route('/basic').put(this.basicCtrl.putHelloWorld);
  }

  /** Creates DELETES API */
  private deletes(router: Router) {
    this.logger.debug('Configuring deletes.');

    router.route('/basic').delete(this.basicCtrl.deleteHelloWorld);
  }
}
