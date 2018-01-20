import * as express from 'express';
import * as session from 'express-session';
import { MemoryStore } from 'express-session';
import * as connectMongo from 'connect-mongo';
import * as parseurl from 'parseurl';

import { FileLogger, Tracking } from '../../core';

export class SessionHandler {
  private logger = new FileLogger('SessionHandler');
  private tracking: Tracking;
  // TODO: Review this variable
  private sessionStore: /*MongoStore | */MemoryStore;

  private sessionOptions: session.SessionOptions = {
    secret: process.env.SECRET_TOKEN || 'shhhhhh',
    resave: false,
    saveUninitialized: true,
    name: 'dash.id',
    cookie: {
      path: '/',
    }
  };

  constructor(store?: string) {
    this.tracking = new Tracking();
    switch (store) {
      case 'mongo':
        this.logger.info('Using mongodb to store session information.');
        const MongoStore = connectMongo(session);
        this.sessionOptions.store = new MongoStore({
          url: process.env.MONGODB_SESSION_URI,
          autoRemove: 'interval',
          autoRemoveInterval: 10
        });
        break;
      default:
        this.logger.info('Using default MemoryStore to store session information.');
        this.sessionStore = new session.MemoryStore();
        this.sessionOptions.store = this.sessionStore;
        break;
    }
  }

  public instanceSession(): express.RequestHandler {
    return session(this.sessionOptions);
  }

  public storePaths(): express.RequestHandler {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
      if (!req.session.views) {
        req.session.views = {};
      }

      // get the url pathname
      const pathname = parseurl(req).pathname;

      // count the views
      req.session.views[pathname] = (req.session.views[pathname] || 0) + 1;

      next();
    };
  }

  public get(req: express.Request, res: express.Response) {
    if (this.sessionStore instanceof MemoryStore) {
      this.sessionStore.get(req.sessionID, (err, data) => {
        res.send({ error: err, sessionStore: data });
      });
    }
  }

  public store(key: string, value: any, req: express.Request): express.RequestHandler {
    if (this.sessionStore instanceof MemoryStore) {
      this.sessionStore.set(req.sessionID, req.session, (err) => {
        console.log(`Error storing in session: ${err}`);
      });
    }
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const uuid = this.tracking.getUUID();
      req.session[key] = value;
      next();
    };
  }

}
