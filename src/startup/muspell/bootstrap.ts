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
import * as errorHandler from 'errorhandler';
import * as figlet from 'figlet';
/** YGGDRASIL imports */
import { MorganUtils, MorganRotateOptions, FileLogger } from '@yggdrasil/logger';
import { SessionHandler } from '@yggdrasil/session';

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
  abstract logger: FileLogger;

  /** Internal expressjs application */
  private app: express.Application;
  /** Internal router */
  private router: express.Router;
  /** Internal logger */
  private bootstrapLogger: FileLogger;

  /** Default constructor */
  constructor() {
    /** Initialize boostrap logger */
    this.bootstrapLogger = new FileLogger('bootstrap');

    this.printBanner();

    this.initialize();
  }

  /**
   * Method to start the appication. It is called by the application to run the server.
   *
   * @param port Port used by expressjs listener.
   * @param hostname Hostname used by expressjs listener.
   * @param callback Callback function.
   */
  public bootstrap(port: number, hostname?: string, callback?: Function): http.Server {
    this.app.set('protocol', (process.env.PROTOCOL || 'http'));
    this.app.set('hostname', (hostname || 'localhost'));
    this.app.set('port', port);
    return this.app.listen(port, (hostname || 'localhost'), this.bootstrapCB());
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
    return { prefix: '/non-api', message: 'Non API routes implemented' };
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
   * Async method that initialise all starting process.
   */
  private async initialize(): Promise<void> {
    /** Creates expressjs application */
    this.app = express();
    this.router = express.Router();

    /** Configures bootstrap */
    await this.internalConfig();

    /** Configures server by application config method (extended method) */
    await this.config(this.app);

    /** Configures database */
    // TODO: Support other databases
    // await this.configureMongoDB();

    /** Add routes */
    const routesResult = await this.routes(this.router);
    this.app.use(routesResult.prefix, this.router);
    this.printRoutes(this.router, routesResult.prefix, (routesResult.message || 'Print Routes'));

    /** Add api routes*/
    const apiResult = await this.api(this.router);
    this.app.use(apiResult.prefix, this.router);
    this.printRoutes(this.router, apiResult.prefix, (apiResult.message || 'Print API Routes'));

  }

  /**
   * Callback function to print server start information.
   */
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
    const session = new SessionHandler(/*'mongo'*/);
    this.app.use(session.instanceSession());
    this.app.use(session.storePaths());

    /** Configure morgan to create a file with rest log traces */
    const morganUtils = new MorganUtils();
    const morganOptions: MorganRotateOptions = {
      interval: '1d',
      maxFiles: 10,
      maxSize: '10M',
      size: '10M'
    };

    /** Configure morgan logger as access log */
    if (process.env.NODE_ENV !== 'test') {
      this.app.use(morgan(process.env.MORGAN_LEVEL || 'debug', { stream: morganUtils.getAccessLogStream(morganOptions) }));
    }

    /** Other configurations */
    this.app.use(compression());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    // TODO: Review this module
    this.app.use(lusca.xframe('SAMEORIGIN'));
    this.app.use(lusca.xssProtection(true));

    /** Catch 404 and forward to error handler */
    this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        err.status = 404;
        next(err);
    });

    // TODO: Review handler error
    /** Error handling */
    if (process.env.NODE_ENV && (process.env.NODE_ENV !== 'production' || process.env.NODE_ENV !== 'pro')) {
      this.app.use(errorHandler());
    }
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
    (<any>mongoose).Promise = global.Promise;

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
    expressListRoutes({ prefix: prefix }, `Application Routes for prefix '${prefix}'`, router );
  }

  private printBanner() {
    // const banner = this.logger.info;
    this.bootstrapLogger.info('PRINT BANNER');
    /*figlet.text('Yggdrasil', {
      font: 'Doh',
      horizontalLayout: 'fitted',
      verticalLayout: 'fitted'
    }, (err: any, data: any) => {
      if (err) {
          console.log('Something went wrong...');
          console.dir(err);
          return;
      }
      banner(data);
    });*/
  }
}
