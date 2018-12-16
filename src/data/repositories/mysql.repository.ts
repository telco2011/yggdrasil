import { YGLogger } from '../../core';
import { YggdrasilRepository } from '../repository';
import { IYggdrasilRepository } from '../../core/modules/data/interfaces';

import { Connection, ConnectionOptions, EntityManager, getManager, createConnection } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

export class MysqlDBRepository extends YggdrasilRepository implements IYggdrasilRepository {

	private defaultConnectionOptions: MysqlConnectionOptions;

	public logger: YGLogger;

	public connection: Connection;

	public manager: EntityManager;

	constructor() {
		super();
		this.logger = new YGLogger(MysqlDBRepository.name);
		this.defaultConnectionOptions = {
			type: 'mysql',
			host: 'localhost',
			port: 3306,
			username: 'yggdrasil',
			password: 'yggdrasil',
			database: 'yggdrasil',
			synchronize: true,
			logging: false,
			entities: [
				'dist/repository/entities/**/*.js'
			],
			subscribers: [
				'dist/repository/subscribers/**/*.js'
			],
			migrations: [
				'dist/repository/migrations/**/*.js'
			]
		};
	}

	public getManager(): EntityManager {
		return getManager();
	}

	public async createConnection(options?: MysqlConnectionOptions) {
		let mergeOptions: MysqlConnectionOptions;
		if (!options) {
			this.logger.debug(`No 'MysqlConnectionOptions' subministrated. Use default options`);
		}
		mergeOptions = { ...this.defaultConnectionOptions,
			...options
		};
		this.logger.info(`DB config options: ${JSON.stringify(mergeOptions)}`);
		this.connection = await createConnection(mergeOptions);
	}

}
