import {
	NextFunction,
	Request,
	Response,
	Router
} from 'express';
import {
	Strategy,
	ExtractJwt,
	StrategyOptions
} from 'passport-jwt';

import {
	API
} from './api.utils';

import {
	Authorization
} from '../security';
import {
	FileLogger
} from '../core';

/**
 * / BaseRoutes
 *
 * @class BaseRoutes
 */
export abstract class BaseRoutes {

	public abstract logger: FileLogger;

	protected API = API;
	protected auth: Authorization;

	private baseLogger: FileLogger;

	constructor() {
		this.baseLogger = new FileLogger('BaseRoutes');
	}

	public abstract create(router: Router);

	// TODO: Review this tslint
	// tslint:disable-next-line
	protected initJWT(fn: Function) {
		/** Authentication */
		const opts: StrategyOptions = {
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.SECRET_TOKEN || 'shhhh'
		};
		this.auth = new Authorization(opts);

		this.auth.initJWT(fn);
	}

}
