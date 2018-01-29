import {
  IYggdrasilMysqlConnectionOptions,
  IYggdrasilPostgresConnectionOptions,
  IYggdrasilSqliteConnectionOptions,
  IYggdrasilOracleConnectionOptions,
  IYggdrasilMongoConnectionOptions
} from '../interfaces';

export declare type YggdrasilConnectionOptions = IYggdrasilMysqlConnectionOptions | IYggdrasilPostgresConnectionOptions | IYggdrasilSqliteConnectionOptions | IYggdrasilOracleConnectionOptions | IYggdrasilMongoConnectionOptions;
export declare type YggdrasilDatabaseType = 'mysql' | 'postgres' | 'mariadb' | 'sqlite' | 'oracle' | 'mongodb';
