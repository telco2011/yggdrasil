import {
	YGLogger
} from '../core';

import {
	Connection,
	ConnectionOptions,
	EntityManager
} from 'typeorm';

export abstract class YggdrasilRepository {

	public abstract logger: YGLogger;

	public abstract manager: EntityManager;

	public abstract connection: Connection;

	public abstract getManager(): EntityManager;

	public abstract async createConnection(options?: ConnectionOptions);

}
