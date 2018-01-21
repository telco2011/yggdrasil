import * as winston from 'winston';
import * as path from 'path';
import * as moment from 'moment';

import { Tracking } from '../tracking';
import { Utils } from '../utils';

/** Log level enumeration */
enum LEVEL {

  /**
   * Shows log traces from debug to error. Recommended in development/test environments.
   */
  DEBUG = 'debug',

  /**
   * Shows log traces from info to error. Recommended in production environments.
   */
  INFO = 'info',

  /**
   * Shows log traces from warn to error.
   */
  WARN = 'warn',

  /**
   * Shows log traces only for error.
   */
  ERROR = 'error'
}

/**
 * Description
 * ===========
 *
 * Gives log functionality to the server. It is useful to follow the server application in a production environment because
 * it creates a file log into {installationPath}/logs/server.log with all the log traces created into it. Also, it creates
 * a {installationPath}/logs/exception.log with the exceptions ocurred in the server application.
 *
 * Dependencies
 * ============
 * This module use some dependencies:
 * process params
 * --------------
 * - __process.env.FILELOGGER_LOG_LEVEL__: param to configure log level. See {@link LEVEL} to know the values for this param.
 *
 * Usage
 * =====
 *
 * ```javascript
 * import { FileLogger } from './yggdrasil/logger';
 *
 * const logger = new FileLogger('domain');
 * logger.debug('Message');
 * logger.info('Message');
 * logger.warn('Message');
 * logger.error('Message');
 * ```
 */
export class FileLogger {

  /** Contains the application log name. */
  private static FILELOGGER_LOG_NAME = 'server.log';

  /** Contains the exception log name. */
  private static FILELOGGER_EXCEPTION_LOG_NAME = 'exception.log';

  /** Default logger variable. */
  private logger: winston.LoggerInstance;

  /** String that represents which module write the log. */
  private sourceModule: string;

  /** Default level */
  private level = 'debug';

  /**
   * Default constructor.
   * @param  {string} sourceModule Where is it from. It is mandatory to know what module prints the log trace.
   * @param  {winston.transports} transports?
   */
  constructor(sourceModule: string, transports?: winston.TransportInstance[]) {
    if (process.env.FILELOGGER_LOG_LEVEL != null) {
      this.level = process.env.FILELOGGER_LOG_LEVEL;
    }
    this.sourceModule = sourceModule;

    const defaultTransports: winston.TransportInstance[] = [
      new (winston.transports.Console)({
        colorize: true,
        level: this.level,
      }),
      new (winston.transports.File)({
        filename: path.join(Utils.appLogsPath, FileLogger.FILELOGGER_LOG_NAME),
        level: this.level
      })
    ];

    this.logger = new (winston.Logger)({
      levels: {
        error: 0,
        warn: 1,
        info: 2,
        debug: 3,
        all: 4
      },
      transports: (transports) ? transports : defaultTransports,
      exceptionHandlers: [
        new (winston.transports.File)({
          filename: path.join(Utils.appLogsPath, FileLogger.FILELOGGER_EXCEPTION_LOG_NAME)
        })
      ]
    });
  }

  /**
   * Print log in debug level. See {@link LEVEL}.
   * @param  {string[]} ...message Messages to print.
   * @returns void
   */
  public debug(...message: string[]): void {
    this.log(LEVEL.DEBUG, this.sourceModule, ...message);
  }

  /**
   * Print log in info level. See {@link LEVEL}.
   * @param  {string[]} ...message Messages to print.
   * @returns void
   */
  public info(...message: string[]): void {
    this.log(LEVEL.INFO, this.sourceModule, ...message);
  }

  /**
   * Print log in warn level. See {@link LEVEL}.
   * @param  {string[]} ...message Messages to print.
   * @returns void
   */
  public warn(...message: string[]): void {
    this.log(LEVEL.WARN, this.sourceModule, ...message);
  }

  /**
   * Print log in error level. See {@link LEVEL}.
   * @param  {string[]} ...message Messages to print.
   * @returns void
   */
  public error(...message: string[]): void {
    this.log(LEVEL.ERROR, this.sourceModule, ...message);
  }

  /**
   * Print log trace.
   *
   * Log trace format: '[trackingId][date(UTC)][class][...message]'
   *
   * @param  {LEVEL} level Enum with log level
   * @param  {string} source From where is the message.
   * @param  {string} message Message to print.
   * @returns void
   */
  private log(level: LEVEL, source: string, ...message: string[]): void {
    if (process.env.NODE_ENV !== 'test' || process.env.ENABLE_LOG === 'true') {
      const log = `[${Tracking.trackingId || ''}][${moment().format('DD/MM/YYYY-HH:mm:ss.SSSZ')}][${Utils.capitalize(source)}] - ${message.join(' ')}`;
      switch (level) {
        case LEVEL.INFO:
          this.logger.info(log);
          break;
        case LEVEL.WARN:
          this.logger.warn(log);
          break;
        case LEVEL.ERROR:
          this.logger.error(log);
          break;
        default:
          this.logger.debug(log);
          break;
      }
    }
  }

}
