import { IYggdrasilRepository } from '../interfaces';
import { YggdrasilDatabaseType } from '../types';

import {
	DefaultRepository,
	MongoDBRepository,
	MysqlDBRepository,
	SQLiteDBRepository,
	PostgresQLDBRepository,
	OracleDBRepository,
	MicrosoftSQLServerDBRepository
} from '../../../../data';

export class YggdrasilRepositoryFactory {

	public static getRepository(type: YggdrasilDatabaseType): IYggdrasilRepository {
		switch (type) {
			case 'mongodb':
				return new MongoDBRepository();
			case 'mysql':
			case 'mariadb':
				return new MysqlDBRepository();
			case 'sqlite':
				return new SQLiteDBRepository();
			case 'postgres':
				return new PostgresQLDBRepository();
			case 'oracle':
				return new OracleDBRepository();
			case 'mssql':
				return new MicrosoftSQLServerDBRepository();
			default:
				return new DefaultRepository();
		}
	}

}
