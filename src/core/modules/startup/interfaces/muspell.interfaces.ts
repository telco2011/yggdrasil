import { YggdrasilDatabaseType, YggdrasilConnectionOptions } from '../../data/types';

import { EApplicationType, EViewEngine } from '../enums';

/**
 * Interface for response when the application configures @method api and @method routes methods.
 *
 * @interface IBootstrapRoute
 */
export interface IBootstrapRoute {
	prefix: string;									// API prefix
	message?: string;								// Optional message to show in log
}

/**
 * Interface for yggdrasil configuration options
 *
 * @interface IYggdrasilOptions
 */
export interface IYggdrasilOptions {
	application?: {									// YGGDRASIL APPLICATION configurations (optional)
		type: EApplicationType;						// This property configures the yggdrasil application (required)
		views?: {									// VIEWS configurations (optional)
			homeURL?: string;						// This property configures the redirection to home when yggdrasil application is WEB (optional)
			view_engine: EViewEngine;				// This property configures which yggdrasil view engine is used in the application (required)
		},
		database?: {								// DATABASE configurations (optional)
			type?: YggdrasilDatabaseType;			// This property allows to select the database type (optional)
			options?: YggdrasilConnectionOptions;	// This property allows to configure the database. If this property is filled, 'type' is not needed (optional)
		}
	};
}
