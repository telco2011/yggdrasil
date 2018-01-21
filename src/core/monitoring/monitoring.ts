import { BaseRoutes, Router } from '../../mvc';
import { FileLogger } from '../../core';

import { MonitorSessionCtrl } from './controllers/session.ctrl';

export class Monitoring extends BaseRoutes {

  /** Monitoring logger */
  public logger: FileLogger;

  /** Declare controllers */
  private monitorSessionCtrl: MonitorSessionCtrl;

  /** Default constructor */
  constructor(router: Router) {
    super();
    this.logger = new FileLogger(Monitoring.name);
    this.monitorSessionCtrl = new MonitorSessionCtrl();

    /** Creates routes */
    this.create(router);
  }

  public create(router: Router) {
    this.logger.debug('Creating SessionRoutes routes.');
    router.route('/session').get(this.monitorSessionCtrl.getSession);
  }

}
