import * as express from 'express';

import { SessionHandler } from '../../security';

export class Monitoring {

  public getSession = (req: express.Request, res: express.Response) => {
    res.send(req.session.getSessionStore(req));
  }

}
