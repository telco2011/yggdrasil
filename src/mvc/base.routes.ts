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

import {
	CallbackFunctionType
} from '../core/modules/startup/types';
/**
 * / BaseRoutes
 *
 * @class BaseRoutes
 */
export abstract class BaseRoutes {

	private baseLogger: FileLogger;

	public abstract logger: FileLogger;

	protected API = API;
	protected auth: Authorization;

	constructor() {
		this.baseLogger = new FileLogger('BaseRoutes');
	}

	public abstract create(router: Router);

	protected initJWT(fn: CallbackFunctionType) {
		/** Authentication */
		const opts: StrategyOptions = {
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.SECRET_TOKEN || 'shhhh'
		};
		this.auth = new Authorization(opts);

		this.auth.initJWT(fn);
	}

}
