/** Third-party library imports */
import * as http from 'http';
import * as express from 'express';
import * as expressListRoutes from 'express-list-routes';
// TODO: Review import
// import * as flash from 'express-flash-notification';
import * as sass from 'node-sass-middleware';
import * as compression from 'compression';
import * as lusca from 'lusca';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as figlet from 'figlet';

/** YGGDRASIL imports */
import { MorganUtils, IMorganRotateOptions, FileLogger } from '../../logger';
import { Monitoring } from '../../monitoring';
import { Tracking } from '../../tracking';
import { Utils } from '../../utils';

// TODO: Quit these dependencies to isolate startup only with core
import { SessionHandler } from '../../../security';

import { IBootstrapRoute, IYggdrasilOptions } from '../../modules/startup/interfaces';
import { EApplicationType, EViewEngine } from '../../modules/startup/enums';
import { CallbackFunctionType } from '../../modules/startup/types';

import { YggdrasilRepositoryFactory } from '../../modules/data/factories';
import { IYggdrasilRepository } from '../../modules/data/interfaces';

import { DefaultCtrl } from './controllers/default/default.ctrl';

/**
 * Abstract class to extend by application to initialize the server.
 *
 * @abstract Bootstrap
 */
export abstract class Bootstrap {

	/** Force to implement logger by application */
	public abstract logger: FileLogger;

	/** Internal expressjs application */
	private app: express.Application;

	/** Internal router */
	private router: express.Router;

	/** Internal logger */
	private bootstrapLogger: FileLogger;

	/** Repository */
	private repository: IYggdrasilRepository;

	/** Session */
	private session: SessionHandler;

	/** Yggdrasil version */
	private yggdrasilVersion: string = Utils.getYggdrasilVersion();

	/** Default constructor */
	constructor() {
		/** Initialize bootstrap logger */
		this.bootstrapLogger = new FileLogger(Bootstrap.name);
	}

	/**
	 * Method to start the application. It is called by the application to run the server.
	 *
	 * @param port Port used by expressjs listener. It must be greater than 0.
	 * @param options Object that implements IYggdrasilOptions to configure yggdrasil application.
	 * @param hostname Hostname used by expressjs listener. Default 'localhost'.
	 * @param callback Callback function.
	 */
	public async bootstrap(port?: number, options?: IYggdrasilOptions, hostname?: string, callback?: CallbackFunctionType): Promise < http.Server > {
		try {
			if (port <= 0) {
				throw Error('Port number must be greater than 0');
			}
			await this.initialize(options);
			this.app.set('protocol', (process.env.PROTOCOL || 'http'));
			this.app.set('hostname', (hostname || 'localhost'));
			this.app.set('port', (port || 3000));
			return this.app.listen(this.app.get('port'), this.app.get('hostname'), this.bootstrapCB());
		} catch (error) {
			this.bootstrapLogger.error(error);
		}
	}

	/**
	 * Method to override to configure application's routes.
	 */
	protected routes(router: express.Router, repository?: IYggdrasilRepository) {
		this.bootstrapLogger.info('Non Routes implemented');
	}

	/**
	 * Method to override to configure application's api routes.
	 *
	 * @param router Router passed to application to configure their api routes.
	 */
	protected api(router: express.Router, repository?: IYggdrasilRepository): IBootstrapRoute {
		this.bootstrapLogger.info('Non API routes implemented');
		return { prefix: '/non-api-routes', message: 'Non API routes implemented' };
	}

	/**
	 * Method to override to configure extras.
	 *
	 * @param app Application passed to application to make their own configurations.
	 */
	protected config(app: express.Application) {
		this.bootstrapLogger.info('Non config method implemented');
	}

	/**
	 * Async method that initialize all starting process.
	 */
	private async initialize(options?: IYggdrasilOptions) {

		/** Print cool yggdrasil banner */
		await this.printBanner();

		// TODO: move this logic to checkenv
		const yggdrasilOptions: IYggdrasilOptions = await this.checkInitializingOptions(options);

		/** Creates expressjs application */
		this.app = express();

		/** Create different routes to manage them */
		const defaultsRouter = express.Router();
		const monitoringRouter = express.Router();
		const APIRouter = express.Router();
		const routesRouter = express.Router();

		/** Session object */
		this.session = new SessionHandler();

		/** Configures bootstrap */
		await this.internalConfig();

		/** Configures database */
		if (yggdrasilOptions.application.database) {
			const databaseType = yggdrasilOptions.application.database.type || yggdrasilOptions.application.database.options.type;
			this.bootstrapLogger.info(`Configuring yggdrasil repository type '${databaseType}'`);
			this.repository = YggdrasilRepositoryFactory.getRepository(databaseType);
			await this.repository.createConnection(yggdrasilOptions.application.database.options);
		} else {
			this.bootstrapLogger.info('Yggdrasil is going to start with no repository configured.');
		}

		this.bootstrapLogger.info(`Application type ${yggdrasilOptions.application.type}.`);

		/** Add view routes */
		if (yggdrasilOptions.application.type === EApplicationType.WEB || yggdrasilOptions.application.type === EApplicationType.HYBRID) {
			await this.configureViews(yggdrasilOptions);
			await this.routes(routesRouter, this.repository);
			this.app.use('/views', routesRouter);
			this.printRoutes(routesRouter, '/views', 'Print View Routes');
		}

		/** Add api routes */
		if (yggdrasilOptions.application.type === EApplicationType.REST || yggdrasilOptions.application.type === EApplicationType.HYBRID) {
			const apiResult = await this.api(APIRouter, this.repository);
			this.app.use(apiResult.prefix, APIRouter);
			this.printRoutes(APIRouter, apiResult.prefix, (apiResult.message || 'Print API Routes'));
		}

		/** Add DEFAULTS routes */
		let homeURL: string;
		try {
			homeURL = yggdrasilOptions.application.views.homeURL;
			this.bootstrapLogger.debug(`Override default yggdrasil access with ${homeURL}`);
		} catch (error) {
			homeURL = null;
			this.bootstrapLogger.debug('Use default yggdrasil access');
		}
		await this.configureDefaults(defaultsRouter, homeURL);
		this.app.use(defaultsRouter);

		/** Configures server by application config method (extended method) */
		await this.config(this.app);

		/** Add MONITORING routes */
		await this.configureMonitoring(monitoringRouter, this.session);
		this.app.use('/monitoring', monitoringRouter);
		this.printRoutes(monitoringRouter, '/monitoring', 'Print Monitoring Routes');

		/** Error handler */
		// TODO: Built error handler
		this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
			if (err instanceof TypeError) {
				this.bootstrapLogger.error(err.stack);
				res.status(500).send({
					status: 500,
					message: 'internal error',
					type: 'controlled',
					TypeError: {
						message: err.message,
						stack: err.stack
					}
				});
			} else {
				if (err.message && err.message === `Cannot find module 'pug'`) {
					this.bootstrapLogger.error('Not using the correct view engine. Review view engine configuration.');
				}
				this.bootstrapLogger.error(err);
				res.status(500).send({
					status: 500,
					message: 'internal error',
					type: 'internal',
					error: err.message
				});
			}
		});
	}

	/**
	 * Check yggdrasilOptions before start to load the application.
	 *
	 * @param options IYggdrasilOptions
	 */
	private checkInitializingOptions(options: IYggdrasilOptions): IYggdrasilOptions {

		let result: IYggdrasilOptions;
		// Default options
		const yggdrasilOptions: IYggdrasilOptions = {
			application: {
				type: EApplicationType.REST
			}
		};

		if (!options) {
			this.bootstrapLogger.info('No YggdrasilOptions added. Use default YggdrasilOptions.');
			return yggdrasilOptions;
		}

		// Check application type
		switch (options.application.type) {
			case EApplicationType.REST:
				if (options.application.views != null && options.application.views.view_engine) {
					throw Error(`If application type is '${EApplicationType.REST}', views options must be delete.`);
				}
				result = { ...yggdrasilOptions,
					...options
				};
				break;
			case EApplicationType.WEB:
			case EApplicationType.HYBRID:
				if (options.application.views == null) {
					throw Error(`If application type is not '${EApplicationType.REST}', views.view_engine option must be filled up.`);
				}
				result = { ...yggdrasilOptions,
					...options
				};
				break;
			default:
				result = { ...yggdrasilOptions,
					...options
				};
				break;
		}

		// check database
		if (options.application.database) {
			const databaseOpt = options.application.database;
			if (databaseOpt.type && databaseOpt.options) {
				throw Error('If there is database.options, database.type is not necessary, it must be removed.');
			}
		}

		this.bootstrapLogger.debug(`yggdrasilOptions are the following => ${JSON.stringify(result)}`);

		this.bootstrapLogger.info(`${options.application.type} yggdrasil application type is going to start.`);
		return result;
	}

	/**
	 * Configure default routes to show default @yggdrasilts html
	 *
	 * @param router express.Router
	 */
	private configureDefaults(router: express.Router, homeURL?: string) {
		this.bootstrapLogger.info('Configure default routes');
		let defaultCtrl;
		if (homeURL) {
			defaultCtrl = new DefaultCtrl(homeURL);
			router.route('/').get(defaultCtrl.redirectToAppHome);
		} else {
			defaultCtrl = new DefaultCtrl();
			router.route('/').get(defaultCtrl.getDefault);
		}
	}

	/**
	 * Configures yggdrasil monitoring routes
	 *
	 * @param router express.Router
	 * @param session SessionHandler
	 */
	private configureMonitoring(router: express.Router, session: SessionHandler) {
		this.bootstrapLogger.info('Configure monitoring API routes');
		const monitoring = new Monitoring(router, session);
	}

	/**
	 * Configure views engine
	 *
	 * @param options IYggdrasilOptions
	 */
	private configureViews(options: IYggdrasilOptions) {
		this.bootstrapLogger.debug(`Configure view routes.`);
		const publicDir = `${Utils.appRootPath}/dist/public`;
		const viewsDir = `${Utils.appRootPath}/dist/views`;
		this.bootstrapLogger.debug(`Public folder at ${publicDir}. Views folder at ${viewsDir}.`);
		this.app.set('views', viewsDir);
		if (options && options.application && options.application.views && options.application.views.view_engine) {
			this.bootstrapLogger.debug(`Set '${options.application.views.view_engine}' as view engine`);
			this.app.set('view engine', options.application.views.view_engine);
		} else {
			this.bootstrapLogger.debug(`Set 'pug' as default view engine`);
			this.app.set('view engine', EViewEngine.PUG);
		}
		this.bootstrapLogger.debug('Configure sass.');
		this.app.use(sass({
			src: publicDir,
			dest: publicDir
		}));
		// TODO: Review flash feature
		// this.app.use(flash(this.app));
		this.bootstrapLogger.debug('Configure static server.');
		this.app.use(express.static(publicDir, { maxAge: 31557600000 }));
	}

	/**
	 * Callback function to print server start information.
	 */
	private bootstrapCB(): CallbackFunctionType {
		const info = {
			protocol: this.app.get('protocol'),
			hostname: this.app.get('hostname'),
			port: this.app.get('port'),
			env: this.app.get('env')
		};
		const nodeEnv: string = process.env.NODE_ENV;
		return () => {
			if (nodeEnv != null && (nodeEnv !== ('production' as string) || nodeEnv !== ('pro' as string))) {
				this.bootstrapLogger.warn('You are running the project on non production environment.');
			}
			this.bootstrapLogger.info(`Application up and running at ${info.protocol}://${info.hostname}:${info.port} in mode '${info.env}'`);
			this.bootstrapLogger.info('Press CTRL-C to stop');
		};
	}

	/**
	 * Base server configuration.
	 */
	private internalConfig() {
		this.bootstrapLogger.debug('Start internalConfig');

		/** Session */
		this.app.use(this.session.instanceSession());
		this.app.use(this.session.storePaths());

		/** ARCHITECTURE INITIALIZATION */
		/** Tracking */
		this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
			const uuid = Tracking.getUUID();
			this.session.store('tracking-id', uuid, req);
			next();
		});

		// TODO: Change morgan configuration into logger module
		/** Configure morgan to create a file with rest log traces */
		const morganUtils = new MorganUtils();
		const morganOptions: IMorganRotateOptions = {
			interval: '1d',
			maxFiles: 10,
			maxSize: '10M',
			size: '10M'
		};

		/** Configure morgan logger as access log */
		if (process.env.NODE_ENV !== 'test') {
			const level = process.env.MORGAN_LEVEL || 'common';
			this.app.use(morgan(level, {
				stream: morganUtils.getAccessLogStream(morganOptions)
			}));
		}

		/** Other configurations */
		this.app.use(compression());
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: false }));
		// TODO: Review this module
		this.app.use(lusca.xframe('SAMEORIGIN'));
		this.app.use(lusca.xssProtection(true));
	}

	/**
	 *
	 * @param router Application router that contains all the routes.
	 * @param prefix Routes prefix.
	 * @param msg Optional. Log message.
	 */
	private printRoutes(router: express.Router, prefix: string, msg?: string) {
		this.bootstrapLogger.debug(msg || 'Print routes');
		if (process.env.NODE_ENV !== 'test' || process.env.ENABLE_LOG === 'true') {
			// TODO: Review this tslint
			/* tslint:disable-next-line */
			expressListRoutes({ prefix: prefix }, `Application Routes for prefix '${prefix}'`, router);
		}
	}

	/**
	 * Get Banner information from figlet module
	 */
	private getBanner(): Promise < any > {
		return new Promise((resolve, reject) => {
			figlet.text('Yggdrasil', {
				font: 'Doh',
				horizontalLayout: 'fitted',
				verticalLayout: 'fitted'
			}, (err: any, data: any) => {
				if (err) {
					reject(err);
				}
				resolve(data);
			});
		});
	}

	/**
	 * Print a cool banner in the logger.
	 */
	private async printBanner(): Promise < void > {
		const preMessage = 'Starting @yggdrasilts architecture';
		const postMessage = `@yggdrasilts version - ${this.yggdrasilVersion}`;
		await this.getBanner()
			.then(data => {
				this.bootstrapLogger.info(`${preMessage}${data}\n\n${postMessage}\n\n`);
			})
			.catch(err => this.bootstrapLogger.error(`Something wrong getting banner: ${err}`));

	}
}
