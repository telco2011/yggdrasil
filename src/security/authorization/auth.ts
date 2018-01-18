import * as passportModule from 'passport';
import * as passportJWT from 'passport-jwt';
import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt';

import { FileLogger } from '../../core';

export class Authorization {
  private logger = new FileLogger('Authorization');
  private passport;
  private opts: StrategyOptions;
  private authenticate: any;

  constructor(opts: StrategyOptions) {
    this.addStrategyOptions(opts);

    this.authenticate = {
      JWT: this.jwtAuthentication
    };
  }

  public initJWT(fn) {
    this.logger.info('Initializing passport JWT.');
    this.logger.debug(`JWT fn => ${fn}`);
    try {
      this.passport = passportModule.use(new Strategy(this.opts, fn));
    } catch (error) {
      this.logger.error('Error initializing passport JWT', error);
    }
  }

  private jwtAuthentication = () => {
    this.logger.debug('Using JWT authentication.');
    return this.passport.authenticate('jwt', { session: false });
  }

  private addStrategyOptions = (opts: StrategyOptions) => {
    this.opts = opts;
  }
}
