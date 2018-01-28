import { FileLogger } from '../core';

import { Connection, ConnectionOptions, MongoEntityManager, createConnection, getConnection, getMongoManager } from 'typeorm';
import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions';

export class MongoDBRepository {

  private logger: FileLogger;

  private defaultOptions: ConnectionOptions;
  private connection: Connection;
  private manager: MongoEntityManager;

  constructor() {
    this.logger = new FileLogger(MongoDBRepository.name);
    this.defaultOptions = {
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

  public getConnection(): Connection {
    return getConnection();
  }

  public getManager(): MongoEntityManager {
    return getMongoManager();
  }

  public async createConnection(options?: ConnectionOptions) {
    this.logger.debug('TYPE OF CONNECTION => ');
    console.log(typeof options);
    /*if (options) {
      this.logger.debug('Merging options');
      const mergeOptions = { ...this.defaultOptions, ...options };
      this.defaultOptions = mergeOptions;
    } else {
      this.logger.debug(`No 'MongoConnectionOptions' subministrated. Use default options`);
    }*/
    this.logger.info(`DB config options: ${this.defaultOptions}`);
    this.connection = await createConnection({ ...this.defaultOptions });
  }

}
