import * as express from 'express';
import * as session from 'express-session';
import {
	MemoryStore
} from 'express-session';
import * as connectMongo from 'connect-mongo';
import * as parseurl from 'parseurl';

import {
	FileLogger,
	Tracking
} from '../../core';

export class SessionHandler {
	private logger = new FileLogger('SessionHandler');
	private tracking: Tracking;
	// TODO: Review this variable
	private sessionStore: /*MongoStore | */ MemoryStore;
	private sessionID: string;

	private sessionOptions: session.SessionOptions = {
		secret: process.env.SECRET_TOKEN || 'shhhhhh',
		resave: false,
		saveUninitialized: true,
		name: 'dash.id',
		cookie: {
			path: '/',
		}
	};

	/**
	 * Default constructor
	 *
	 * @param store String option for selecting session storage
	 */
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

	/**
	 * Initialise session
	 */
	public instanceSession(): express.RequestHandler {
		return session(this.sessionOptions);
	}

	/**
	 * Stores acceded routes
	 */
	public storePaths(): express.RequestHandler {
		return (req: express.Request, res: express.Response, next: express.NextFunction) => {
			if (!req.session.routes) {
				req.session.routes = {};
			}

			// get the url pathname
			const pathname = parseurl(req).pathname;

			// count the routes
			req.session.routes[pathname] = (req.session.routes[pathname] || 0) + 1;

			next();
		};
	}

	/**
	 * Gets all sessions.
	 *
	 * @param req express.Request object
	 */
	public getSessionsInfo(req: express.Request): Promise < any > {
		return new Promise((resolve, reject) => {
			if (this.sessionStore instanceof MemoryStore) {
				this.sessionStore.all((err, sess) => {
					if (err) {
						reject(err);
					}
					resolve(sess);
				});
			} else {
				resolve(null);
			}
		});
	}

	/**
	 * Gets session store object.
	 *
	 * @param req express.Request object
	 */
	// TODO: Create sessionStoreResponse obj
	public getSessionStore(req: express.Request): Promise < any > {
		return new Promise((resolve, reject) => {
			if (this.sessionStore instanceof MemoryStore) {
				this.sessionStore.get(req.sessionID, (err, data) => {
					const sessionResponse = {
						sessionId: req.sessionID,
						sessionStore: data,
						error: err
					};
					resolve(sessionResponse);
				});
			} else {
				resolve(null);
			}
		});
	}

	/**
	 * Stores object into session
	 *
	 * @param key String identifier for value object
	 * @param value Object to store with key identifier
	 * @param req Request
	 */
	public store(key: string, value: any, req: express.Request): void {
		req.session[key] = value;
	}

}
