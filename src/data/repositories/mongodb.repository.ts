import {
	FileLogger
} from '../../core';
import {
	YggdrasilRepository
} from '../repository';
import {
	IYggdrasilRepository
} from '../../core/modules/data/interfaces';

import {
	Connection,
	MongoEntityManager,
	createConnection,
	getMongoManager
} from 'typeorm';
import {
	MongoConnectionOptions
} from 'typeorm/driver/mongodb/MongoConnectionOptions';

export class MongoDBRepository extends YggdrasilRepository implements IYggdrasilRepository {

	public logger: FileLogger;

	public manager: MongoEntityManager;

	public connection: Connection;

	private defaultConnectionOptions: MongoConnectionOptions;

	constructor() {
		super();
		this.logger = new FileLogger(MongoDBRepository.name);
		this.defaultConnectionOptions = {
			type: 'mongodb',
			host: 'localhost',
			port: 27017,
			database: 'yggdrasil',
			synchronize: true,
			logging: false,
			entities: [
				'dist/repository/entities/*.js'
			],
			subscribers: [
				'dist/repository/subscribers/*.js'
			],
			migrations: [
				'dist/repository/migrations/*.js'
			]
		};
	}

	public getManager(): MongoEntityManager {
		return getMongoManager();
	}

	public async createConnection(options?: MongoConnectionOptions) {
		let mergeOptions: MongoConnectionOptions;
		if (!options) {
			this.logger.debug(`No 'MongoConnectionOptions' subministrated. Use default options`);
		}
		mergeOptions = { ...this.defaultConnectionOptions,
			...options
		};
		this.logger.info(`DB config options: ${JSON.stringify(mergeOptions)}`);
		this.connection = await createConnection(mergeOptions);
	}

}
