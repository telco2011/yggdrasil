import {
	FileLogger
} from '../core';

import {
	Connection,
	ConnectionOptions,
	EntityManager
} from 'typeorm';

export abstract class YggdrasilRepository {

	public abstract logger: FileLogger;

	public abstract manager: EntityManager;

	public abstract connection: Connection;

	public abstract getManager(): EntityManager;

	public abstract async createConnection(options?: ConnectionOptions);

}
