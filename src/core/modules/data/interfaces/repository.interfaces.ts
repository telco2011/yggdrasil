import { EntityManager, ConnectionOptions } from 'typeorm';

export interface IYggdrasilRepository {
	getManager(): EntityManager;
	createConnection(options?: ConnectionOptions);
}
