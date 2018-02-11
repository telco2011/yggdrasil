import { FileLogger } from '../../core';
import { YggdrasilRepository } from '../repository';
import { IYggdrasilRepository } from '../../core/modules/data/interfaces';

import { Connection, ConnectionOptions, EntityManager, getManager, createConnection } from 'typeorm';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';

export class SQLiteDBRepository extends YggdrasilRepository implements IYggdrasilRepository {

	public logger: FileLogger;

	public connection: Connection;

	public manager: EntityManager;

	private defaultConnectionOptions: SqliteConnectionOptions;

	constructor() {
		super();
		this.logger = new FileLogger(SQLiteDBRepository.name);
		this.defaultConnectionOptions = {
			type: 'sqlite',
			database: 'yggdrasil.db',
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

	public getManager(): EntityManager {
		return getManager();
	}

	public async createConnection(options?: SqliteConnectionOptions) {
		let mergeOptions: SqliteConnectionOptions;
		if (!options) {
			this.logger.debug(`No 'SqliteConnectionOptions' subministrated. Use default options`);
		}
		mergeOptions = { ...this.defaultConnectionOptions,
			...options
		};
		this.logger.info(`DB config options: ${JSON.stringify(mergeOptions)}`);
		this.connection = await createConnection(mergeOptions);
	}

}
