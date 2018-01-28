import { FileLogger } from '../../core';
import { Repository } from '../repository';

import { Connection, MongoEntityManager, createConnection, getMongoManager } from 'typeorm';
import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions';

export class MongoDBRepository extends Repository {

  public logger: FileLogger;

  public connection: Connection;
  public manager: MongoEntityManager;
  public defaultOptions: MongoConnectionOptions;

  constructor() {
    super();
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

  public getManager(): MongoEntityManager {
    return getMongoManager();
  }

  public async createConnection(options?: MongoConnectionOptions) {
    let mergeOptions: MongoConnectionOptions;
    if (!options) {
      this.logger.debug(`No 'MongoConnectionOptions' subministrated. Use default options`);
    }
    mergeOptions = { ...this.defaultOptions, ...options };
    this.logger.info(`DB config options: ${JSON.stringify(mergeOptions)}`);
    this.connection = await createConnection(mergeOptions);
  }

}
