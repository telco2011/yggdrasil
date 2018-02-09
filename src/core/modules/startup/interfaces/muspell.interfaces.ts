import {
	YggdrasilDatabaseType,
	YggdrasilConnectionOptions
} from '../../data/types';

import {
	EApplicationType,
	EViewEngine
} from '../enums';

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
 * Interface for yggdrasil configuration options
 *
 * @interface IYggdrasilOptions
 */
export interface IYggdrasilOptions {
	application?: {
		type: EApplicationType;
		views?: {
			view_engine: EViewEngine;
		},
		database?: {
			type: YggdrasilDatabaseType;
			options?: YggdrasilConnectionOptions;
		}
	};
}
