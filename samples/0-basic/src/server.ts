/** yggdrasil imports */
import { Bootstrap, IBootstrapRoute } from '@yggdrasil/startup';
import { Router } from '@yggdrasil/mvc';
import { FileLogger } from '@yggdrasil/logger';

/** Application imports */
import { BasicAPIRoute } from './routes/api/basic.route';

/**
 * @class YggdrasilServer
 */
export class YggdrasilServer extends Bootstrap {

  /** YggdrasilServer logger */
  logger: FileLogger;

  /** Default constructor */
  constructor() {
    super();

    this.logger = new FileLogger(YggdrasilServer.name);
  }

  /**
   * Creates API routes
   * @param router Express Router
   */
  api(router: Router): IBootstrapRoute {
    const auth = new BasicAPIRoute(router);

    return { prefix: '/api' };
  }

}
