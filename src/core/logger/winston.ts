import * as winston from 'winston';
import * as Transport from 'winston-transport';
import * as path from 'path';
import * as moment from 'moment';

import { Tracking } from '../tracking';
import { Utils } from '../utils';

/** Log level enumeration */
export enum LEVEL {

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
 */
export class FileLoggerSingleton {

	/** Contains the application log name. */
	private static FILELOGGER_LOG_NAME = 'server.log';

	/** Contains the exception log name. */
	private static FILELOGGER_EXCEPTION_LOG_NAME = 'exception.log';

	/** Logger */
	private static logger: FileLoggerSingleton;

	/** LoggerOptions */
	private static loggerOptions: winston.LoggerOptions;

	/** Container for the logger */
	private container: winston.Container;

	/** Default level */
	private level = 'debug';

	/**
	 * Default constructor.
	 */
	constructor() {
		if (process.env.FILELOGGER_LOG_LEVEL != null) {
			this.level = process.env.FILELOGGER_LOG_LEVEL;
		}

		const defaultTransports: Transport[] = [
			new(winston.transports.Console)({ level: this.level }),
			new(winston.transports.File)({
				filename: path.join(Utils.appLogsPath, FileLoggerSingleton.FILELOGGER_LOG_NAME),
				level: this.level
			})
		];
		FileLoggerSingleton.loggerOptions = {
			levels: {
				error: 0,
				warn: 1,
				info: 2,
				debug: 3,
				all: 4
			},
			transports: defaultTransports,
			exceptionHandlers: [
				new(winston.transports.File)({
					filename: path.join(Utils.appLogsPath, FileLoggerSingleton.FILELOGGER_EXCEPTION_LOG_NAME)
				})
			]
		};
		this.container = new winston.Container(FileLoggerSingleton.loggerOptions);
	}

	/**
	 * Gets Logger instance
	 */
	public static getInstance(sourceModule: string): FileLoggerSingleton {
		if (!FileLoggerSingleton.logger) {
			FileLoggerSingleton.logger = new FileLoggerSingleton();
		}
		if (!FileLoggerSingleton.logger.container.get(sourceModule)) {
			FileLoggerSingleton.logger.container.add(sourceModule, FileLoggerSingleton.loggerOptions);
		}
		return FileLoggerSingleton.logger;
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
	public log(level: LEVEL, source: string, ...message: string[]): void {
		if (process.env.NODE_ENV !== 'test' || process.env.ENABLE_LOG === 'true') {
			const log = `[${Tracking.trackingId || '#'}][${moment().format('DD/MM/YYYY-HH:mm:ss.SSSZ')}][${Utils.capitalize(source)}] - ${message.join(' ')}`;
			switch (level) {
				case LEVEL.INFO:
					this.container.get(source).info(log);
					break;
				case LEVEL.WARN:
					this.container.get(source).warn(log);
					break;
				case LEVEL.ERROR:
					this.container.get(source).error(log);
					break;
				default:
					this.container.get(source).debug(log);
					break;
			}
		}
	}

}
