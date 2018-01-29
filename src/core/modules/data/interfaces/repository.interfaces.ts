import { YggdrasilConnectionOptions } from '../types';

export interface IYggdrasilRepository {
  createConnection(options?: YggdrasilConnectionOptions);
}

export interface IYggdrasilMysqlConnectionOptions {
  readonly url?: string;
  readonly host?: string;
  readonly port?: number;
  readonly database?: string;
}

export interface IYggdrasilPostgresConnectionOptions {
  readonly url?: string;
  readonly host?: string;
  readonly port?: number;
  readonly database?: string;
}

export interface IYggdrasilSqliteConnectionOptions {
  readonly url?: string;
  readonly host?: string;
  readonly port?: number;
  readonly database?: string;
}

export interface IYggdrasilOracleConnectionOptions {
  readonly url?: string;
  readonly host?: string;
  readonly port?: number;
  readonly database?: string;
}

export interface IYggdrasilMongoConnectionOptions {
  readonly url?: string;
  readonly host?: string;
  readonly port?: number;
  readonly database?: string;
}
