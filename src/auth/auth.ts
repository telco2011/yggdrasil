import * as passportModule from 'passport';
import * as passportJWT from 'passport-jwt';
import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt';

import { FileLogger } from '../logger';

export class Authorization {
  logger = new FileLogger('Authorization');
  passport;
  opts: StrategyOptions;
  authenticate: any;

  constructor(opts: StrategyOptions) {
    this.addStrategyOptions(opts);

    this.authenticate = {
      JWT: this.jwtAuthentication
    };
  }

  private jwtAuthentication = () => {
    this.logger.debug('Using JWT authentication.');
    return this.passport.authenticate('jwt', { session: false });
  }

  private addStrategyOptions = (opts: StrategyOptions) => {
    this.opts = opts;
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
}
