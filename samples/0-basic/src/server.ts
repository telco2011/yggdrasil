/** yggdrasil imports */
import { Bootstrap, IBootstrapRoute } from '@yggdrasil/startup';
import { Router } from '@yggdrasil/mvc';
import { FileLogger } from '@yggdrasil/core';

/** Application imports */
import { BasicAPIRoute } from './routes/api/basic.route';

/**
 * @class YggdrasilServer
 */
export class YggdrasilServer extends Bootstrap {

  /** YggdrasilServer logger */
  public logger: FileLogger;

  /** Default constructor */
  constructor() {
    super();

    this.logger = new FileLogger(YggdrasilServer.name);
  }

  /**
   * Creates API routes
   * @param router Express Router
   */
  public api(router: Router): IBootstrapRoute {
    const basicAPI = new BasicAPIRoute(router);

    return { prefix: '/api' };
  }

  public routes(router: Router) {

    router.route('/index').get((req, res) => res.render('index', { title: 'Hey', message: 'Hello there!'}));

  }

}
