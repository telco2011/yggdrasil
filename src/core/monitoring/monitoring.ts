import { Router } from '../../mvc';
import { FileLogger } from '../../core';
import { SessionHandler } from '../../security';

import { MonitorSessionCtrl } from './controllers/session.ctrl';

export class Monitoring {

  /** Monitoring logger */
  private logger: FileLogger;

  /** Declare controllers */
  private monitorSessionCtrl: MonitorSessionCtrl;

  /** Default constructor */
  constructor(router: Router, session: SessionHandler) {
    this.logger = new FileLogger(Monitoring.name);
    this.monitorSessionCtrl = new MonitorSessionCtrl(session);

    /** Creates routes */
    this.create(router);
  }

  public create(router: Router) {
    this.logger.debug('Creating SessionRoutes routes.');
    router.route('/session').get(this.monitorSessionCtrl.getSession);
    router.route('/sessions').get(this.monitorSessionCtrl.getSessions);
  }

}
