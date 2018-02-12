import * as requireENV from 'require-env';
import chalk from 'chalk';

import { IMessages } from '../../modules/startup/interfaces';

/**
 * @class Startup
 */
export class Startup {

	/** Check environment attribute */
	private checkENV = requireENV;

	/** Messages attribute */
	private messages: IMessages;

	/** Attribute to store optional environment variables */
	private optionalENVs: string[];

	/** Attribute to store required environment variables */
	private requiredENVs: string[];

	/**
	 * Default constructor
	 *
	 * @param requiredENVs Required environment variables
	 * @param optionalENVs Optional environment variables
	 * @param envFile .env file
	 */
	constructor(requiredENVs: string[], optionalENVs: string[], envFile?: string) {
		if (!requiredENVs) {
			console.error(`${chalk.red('error:')} The requiredENV array is needed to check the startup.`);
			throw new Error();
		}
		this.messages = {
			errors: [],
			warnings: []
		};
		if (envFile) {
			this.checkENV.inherit(envFile);
		}
		this.requiredENVs = requiredENVs;
		this.optionalENVs = optionalENVs;
	}

	/**
	 * Method that checks the environment before start the application.
	 */
	public startupCheck = async () => {
		return new Promise((resolve, reject) => {
			let resolutionMessage = `${chalk.green('info:')} ENV is correct. Start to load the server.`;
			const requireCheck = this.checkRequiredENVs();
			const optionalCheck = this.checkOptionalENVs();

			if (this.messages.warnings.length > 0) {
				for (const warn of this.messages.warnings) {
					console.log(`${chalk.yellow('warn:')} ${warn}`);
				}
				resolutionMessage = `${chalk.yellow('warn:')} Start to load the server with some ENV warnings.`;
			}
			if (this.messages.errors.length > 0) {
				for (const error of this.messages.errors) {
					console.log(`${chalk.red('error:')} ${error}`);
				}
				console.log(`${chalk.red('error:')} Stop to load the server due to some ENV errors.`);
				process.exit(1);
			}

			console.log(resolutionMessage);
			resolve();
		});
	}

	/**
	 * Method to check required environment variables
	 */
	private checkRequiredENVs = async () => {
		return new Promise((resolve, reject) => {
			for (const prop of this.requiredENVs) {
				try {
					this.checkENV.require(prop);
				} catch (error) {
					this.messages.errors.push(error.message);
				}
			}
			resolve();
		});
	}

	/**
	 * Method to check optional environment variables
	 */
	private checkOptionalENVs = async () => {
		return new Promise((resolve, reject) => {
			for (const prop of this.optionalENVs) {
				try {
					this.checkENV.require(prop);
				} catch (error) {
					this.messages.warnings.push(error.message);
				}
			}
			resolve();
		});
	}

}
