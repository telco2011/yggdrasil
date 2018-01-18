import * as express from 'express';
import * as session from 'express-session';
import * as connectMongo from 'connect-mongo';
import * as parseurl from 'parseurl';

import { FileLogger } from '../../core';

export class SessionHandler {
  private logger = new FileLogger('SessionHandler');

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
        break;
    }
  }

  public instanceSession(): express.RequestHandler {
    return session(this.sessionOptions);
  }

  public storePaths(): express.RequestHandler {
    return (req, res, next) => {
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

}