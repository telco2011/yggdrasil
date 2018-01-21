import * as express from 'express';

import { SessionHandler } from '../../security';

export class Monitoring {

  public static getSession(session: SessionHandler) {
    return (req: express.Request, res: express.Response) => {
      res.send(session.getSessionStore(req));
    };
  }

}
