import { NextFunction, Request, Response, Router } from 'express';
import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt';

import { API } from './api.utils';

import { Authorization } from '../auth';
import { FileLogger } from '../logger';

/**
 * / BaseRoutes
 *
 * @class BaseRoutes
 */
export abstract class BaseRoutes {

  abstract logger: FileLogger;

  protected API = API;
  protected auth: Authorization;

  private baseLogger: FileLogger;

  constructor() {
    this.baseLogger = new FileLogger('BaseRoutes');
  }

  abstract create(router: Router);

  protected initJWT(fn: Function) {
    /** Authentication */
    const opts: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_TOKEN
    };
    this.auth = new Authorization(opts);

    this.auth.initJWT(fn);
  }

}
