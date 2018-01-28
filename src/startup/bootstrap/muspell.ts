/** Third-party library imports */
import * as http from 'http';
import * as express from 'express';
import * as expressListRoutes from 'express-list-routes';
import * as sass from 'node-sass-middleware';
import * as flash from 'express-flash';
import * as compression from 'compression';  // compresses requests
import * as lusca from 'lusca';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as mongoose from 'mongoose';
import * as Q from 'q';
import * as figlet from 'figlet';

/** YGGDRASIL imports */
import {
  MorganUtils, IMorganRotateOptions, FileLogger,
  Monitoring,
  Tracking,
  Utils
} from '../../core';
import { SessionHandler } from '../../security';

import { IBootstrapRoute, IYggdrasilOptions } from './interfaces/muspell.interfaces';
import { EApplicationType, EViewEngine } from './enums/muspell.enums';
import { CallbackFunctionType } from './types/muspell.types';

import { DefaultCtrl } from './controllers/default/default.ctrl';

/**
 * Abstract class to extend by application to initialise the server.
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

  /** Session */
  private session: SessionHandler;

  /** Yggdrasil version */
  private yggdrasilVersion: string = Utils.getYggdrasilVersion();

  /** Default constructor */
  constructor() {
    /** Initialize boostrap logger */
    this.bootstrapLogger = new FileLogger(Bootstrap.name);
  }

  /**
   * Method to start the appication. It is called by the application to run the server.
   *
   * @param port Port used by expressjs listener. It must be greater than 0.
   * @param options Object that implements IYggdrasilOptions to configure yggdrasil application.
   * @param hostname Hostname used by expressjs listener. Default 'localhost'.
   * @param callback Callback function.
   */
  public async bootstrap(port: number, options?: IYggdrasilOptions, hostname?: string, callback?: CallbackFunctionType): Promise<http.Server> {
    if (port <= 0) {
      throw Error('Port number must be greater than 0');
    }
    await this.initialize(options);
    this.app.set('protocol', (process.env.PROTOCOL || 'http'));
    this.app.set('hostname', (hostname || 'localhost'));
    this.app.set('port', port);
    return this.app.listen(port, (hostname || 'localhost'), this.bootstrapCB());
  }

  /**
   * Async method that initialise all starting process.
   */
  public async initialize(options?: IYggdrasilOptions) {

    /** Print cool yggdrasil banner */
    await this.printBanner();

    // TODO: move this logic to checkenv
    const yggdrasilOptions = await this.checkInitializingOptions(options);

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

    /** Configures server by application config method (extended method) */
    await this.config(this.app);

    /** Configures database */
    // TODO: Support other databases
    // await this.configureMongoDB();

    /** Add MONITORING routes */
    await this.configureMonitoring(monitoringRouter, this.session);
    this.app.use('/monitoring', monitoringRouter);
    this.printRoutes(monitoringRouter, '/monitoring', 'Print Monitoring Routes');

    this.bootstrapLogger.info(`Application type ${yggdrasilOptions.application.type}.`);
    /** Add view routes */
    if (yggdrasilOptions.application.type === EApplicationType.WEB || yggdrasilOptions.application.type === EApplicationType.HYBRID) {
      await this.configureViews(yggdrasilOptions);
      await this.routes(routesRouter);
      this.app.use('/views', routesRouter);
      this.printRoutes(routesRouter, '/views', 'Print View Routes');
    }

    /** Add api routes */
    if (yggdrasilOptions.application.type === EApplicationType.REST || yggdrasilOptions.application.type === EApplicationType.HYBRID) {
      const apiResult = await this.api(APIRouter);
      this.app.use(apiResult.prefix, APIRouter);
      this.printRoutes(APIRouter, apiResult.prefix, (apiResult.message || 'Print API Routes'));
    }

    /** Add DEFAULTS routes */
    await this.configureDefaults(defaultsRouter);
    this.app.use(defaultsRouter);

    /** Error handler */
    // TODO: Built error handler
    this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      if (err instanceof TypeError) {
        this.bootstrapLogger.error(err.stack);
        res.status(500).send({ status: 500, message: 'internal error', type: 'controled', TypeError: { message: err.message, stack: err.stack} });
      } else {
        if (err.message && err.message === `Cannot find module 'pug'`) {
          this.bootstrapLogger.error('Not using the correct view engine. Review view engine configuration.');
        }
        this.bootstrapLogger.error(err);
        res.status(500).send({ status: 500, message: 'internal error', type: 'internal', error: err.message });
      }
    });
  }

  /**
   * Method to override to configure application's routes.
   */
  protected routes(router: express.Router) {
    this.bootstrapLogger.info('Non Routes implemented');
  }

  /**
   * Method to override to configure application's api routes.
   *
   * @param router Router passed to application to configure their api routes.
   */
  protected api(router: express.Router): IBootstrapRoute {
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
   * Check yggdrasiloptions before start to load the application.
   *
   * @param options IYggdrasilOptions
   */
  private checkInitializingOptions(options: IYggdrasilOptions): IYggdrasilOptions {

    // Default options
    let yggdrasilOptions: IYggdrasilOptions = {
      application: {
        type: EApplicationType.REST
      }
    };

    if (!options) {
      return yggdrasilOptions;
    }

    switch (options.application.type) {
      case EApplicationType.REST:
        if (options.application.views.view_engine) {
          throw Error(`If application type is '${EApplicationType.REST}', views options must be delete.`);
        }
        break;
      case EApplicationType.WEB:
      case EApplicationType.HYBRID:
        if (options.application.views == null) {
          throw Error(`If application type is not '${EApplicationType.REST}', views.view_engine option must be filled up.`);
        }
        yggdrasilOptions = options;
        break;
      default:
        this.bootstrapLogger.info('Initializations options are correct.');
        yggdrasilOptions = options;
        break;
    }

    return yggdrasilOptions;
  }

  /**
   * Configure default routes to show default @yggdrasil html
   *
   * @param router express.Router
   */
  private configureDefaults(router: express.Router) {
    this.bootstrapLogger.info('Configure default routes');
    const defaultCtrl = new DefaultCtrl();
    router.route('/').get(defaultCtrl.getDefault);
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
    this.app.use(sass({ src: publicDir, dest: publicDir }));
    this.app.use(flash());
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
    return () => {
      if (process.env.NODE_ENV && (process.env.NODE_ENV !== 'production' || process.env.NODE_ENV !== 'pro')) {
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
      this.app.use(morgan(level, { stream: morganUtils.getAccessLogStream(morganOptions) }));
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
   * Configures mongoDB access.
   */
  private configureMongoDB() {
    /** Configure database */
    let mongodbURI;
    if (process.env.NODE_ENV === 'test') {
      mongodbURI = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/yggdrasil';
    } else {
      mongodbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yggdrasil';
    }

    // Use q promises
    global.Promise = Q.Promise;
    (mongoose as any).Promise = global.Promise;

    /** connect to mongoose */
    mongoose.connect(mongodbURI, { useMongoClient: true });

    /** CONNECTION EVENTS */
    // When successfully connected
    mongoose.connection.on('connected', () => {
      this.bootstrapLogger.info('Mongoose connection established.');
    });

    // If the connection throws an error
    mongoose.connection.on('error', () => {
      this.bootstrapLogger.error('Could not connect to mongoDB.');
      throw new Error('Could not connect to mongoDB.');
    });

    // When the connection is disconnected
    mongoose.connection.on('disconnected', () => {
      this.bootstrapLogger.warn('Mongoose default connection disconnected');
    });
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
      // tslint:disable-next-line
      expressListRoutes({ prefix: prefix }, `Application Routes for prefix '${prefix}'`, router );
    }
  }

  /**
   * Get Banner information from figlet module
   */
  private getBanner(): Promise<any> {
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
  private async printBanner(): Promise<void> {
    const preMessage = 'Starting @yggdrasil architecture';
    const postMessage = `@yggdrasil version - ${this.yggdrasilVersion}`;
    await this.getBanner()
      .then(data => {
        this.bootstrapLogger.info(`${preMessage}${data}\n\n${postMessage}\n\n`);
      })
      .catch(err => this.bootstrapLogger.error(`Something wrong getting banner: ${err}`));

  }
}
