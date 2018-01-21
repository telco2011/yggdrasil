/** Third-party library imports */
import * as http from 'http';
import * as express from 'express';
import * as expressListRoutes from 'express-list-routes';
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

/**
 * Interface for response when the application configures @method api and @method routes methods.
 *
 * @interface IBootstrapRoute
 */
export interface IBootstrapRoute {
  /** API prefix */
  prefix: string;

  /** Optional message to show in log */
  message?: string;
}

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
    this.bootstrapLogger = new FileLogger('bootstrap');
  }

  /**
   * Method to start the appication. It is called by the application to run the server.
   *
   * @param port Port used by expressjs listener.
   * @param hostname Hostname used by expressjs listener.
   * @param callback Callback function.
   */
  // TODO: Review this tslint
  // tslint:disable-next-line
  public async bootstrap(port: number, hostname?: string, callback?: Function): Promise<http.Server> {
    await this.initialize();
    this.app.set('protocol', (process.env.PROTOCOL || 'http'));
    this.app.set('hostname', (hostname || 'localhost'));
    this.app.set('port', port);
    return this.app.listen(port, (hostname || 'localhost'), this.bootstrapCB());
  }

  /**
   * Async method that initialise all starting process.
   */
  public async initialize() {
    /** Creates expressjs application */
    this.app = express();
    this.router = express.Router();
    this.session = new SessionHandler();

    /** Print cool yggdrasil banner */
    await this.printBanner();

    /** Configures bootstrap */
    await this.internalConfig();

    /** Configures server by application config method (extended method) */
    await this.config(this.app);

    /** Configures database */
    // TODO: Support other databases
    // await this.configureMongoDB();

    /** MONITORING */
    const monitoringRoutes = await this.configureMonitoring(this.router);
    this.app.use(monitoringRoutes.prefix, this.router);
    this.printRoutes(this.router, monitoringRoutes.prefix, monitoringRoutes.message);

    /** Add routes */
    const routesResult = await this.routes(this.router);
    this.app.use(routesResult.prefix, this.router);
    this.printRoutes(this.router, routesResult.prefix, (routesResult.message || 'Print Routes'));

    /** Add api routes */
    const apiResult = await this.api(this.router);
    this.app.use(apiResult.prefix, this.router);
    this.printRoutes(this.router, apiResult.prefix, (apiResult.message || 'Print API Routes'));

    /** Error handler */
    // TODO: Built error handler
    this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      if (err instanceof TypeError) {
        this.bootstrapLogger.error(err.stack);
        res.status(500).send({ status: 500, message: 'internal error', type: 'internal', TypeError: { message: err.message, stack: err.stack} });
      } else {
        this.bootstrapLogger.error(err);
        res.status(500).send({ status: 500, message: 'internal error', type: 'internal', error: err.message });
      }
    });
  }

  /**
   * Method to override to configure application's routes.
   *
   * @param router Router passed to application to configure their routes.
   */
  protected routes(router: express.Router): IBootstrapRoute {
    this.bootstrapLogger.info('Non Routes implemented');
    return { prefix: '/non-routes', message: 'Non Routes implemented' };
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

  private configureMonitoring(router: express.Router): IBootstrapRoute {
    this.bootstrapLogger.info('Configure monitoring API routes');
    const monitoring = new Monitoring(router);
    return { prefix: '/monitoring', message: 'Configured monitoring API routes' };
  }

  /**
   * Callback function to print server start information.
   */
  // TODO: Review this tslint
  // tslint:disable-next-line
  private bootstrapCB(): Function {
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

  private async printBanner() {
    const preMessage = 'Starting @yggdrasil architecture';
    const postMessage = `@yggdrasil version - ${this.yggdrasilVersion}`;
    await this.getBanner()
      .then(data => {
        this.bootstrapLogger.info(`${preMessage}${data}\n\n${postMessage}\n\n`);
      })
      .catch(err => this.bootstrapLogger.error(`Something wrong getting banner: ${err}`));

  }
}
