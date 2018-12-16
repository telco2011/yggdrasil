import { FileLoggerSingleton, LEVEL } from './winston';

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
 * logger.fatal('Message');
 * ```
 */
export class FileLogger {

	/** Logger */
	private logger: FileLoggerSingleton;

	/** String that represents which module write the log. */
	private sourceModule: string;

	/**
	 * Default constructor.
	 *
	 * @param  {string} sourceModule Where is it from. It is mandatory to know what module prints the log trace.
	 */
	constructor(sourceModule: string) {
		this.sourceModule = sourceModule;
		this.logger = FileLoggerSingleton.getInstance(sourceModule);
	}

	/**
	 * Print log in debug level. See {@link LEVEL}.
	 * @param {string} message Message to print.
	 * @param {any[]} params Other data to print.
	 */
	public debug(message: string, ...params: any[]): void {
		this.logger.log(LEVEL.DEBUG, this.sourceModule, message, params);
	}

	/**
	 * Print log in info level. See {@link LEVEL}.
	 * @param {string} message Message to print.
	 * @param {any[]} params Other data to print.
	 */
	public info(message: string, ...params: any[]): void {
		this.logger.log(LEVEL.INFO, this.sourceModule, message, params);
	}

	/**
	 * Print log in warn level. See {@link LEVEL}.
	 * @param {string} message Message to print.
	 * @param {any[]} params Other data to print.
	 */
	public warn(message: string, ...params: any[]): void {
		this.logger.log(LEVEL.WARN, this.sourceModule, message, params);
	}

	/**
	 * Print log in error level. See {@link LEVEL}.
	 * @param {string} message Message to print.
	 * @param {any[]} params Other data to print.
	 */
	public error(message: string, ...params: any[]): void {
		this.logger.log(LEVEL.ERROR, this.sourceModule, message, params);
	}

	/**
	 * Print log in fatal level. See {@link LEVEL}.
	 * @param {string} message Message to print.
	 * @param {any[]} params Other data to print.
	 */
	public fatal(message: string, ...params: any[]): void {
		this.logger.log(LEVEL.FATAL, this.sourceModule, message, params);
	}

}
