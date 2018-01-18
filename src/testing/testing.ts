import * as chai from 'chai';
import * as chaiHttp from 'chai-http';

import { Server } from '../mvc';

/**
 *
 */
export abstract class YggdrasilTest {

  protected server: Server;
  protected chai = chai;
  protected should = chai.use(chaiHttp).should();

  private app: Promise<Server>;

  constructor(app: Promise<Server>) {
    this.app = app;
  }

  protected before(done) {
    const that = this;
    Promise.resolve(that.app).then(server => {
      that.server = server;
      done();
    });
  }
}
