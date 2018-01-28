import { Connection, MongoEntityManager, createConnection, getConnection, getMongoManager } from 'typeorm';
import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions';

export class MongoDBRepository {

  private defaultOptions: MongoConnectionOptions;
  private connection: Connection;
  private manager: MongoEntityManager;

  constructor() {
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

  public async createConnection(options?: MongoConnectionOptions) {
    if (options) {
      this.defaultOptions = options;
    }
    this.connection = await createConnection({
        type: this.defaultOptions.type,
        host: this.defaultOptions.host,
        port: this.defaultOptions.port,
        database: this.defaultOptions.database,
        synchronize: this.defaultOptions.synchronize,
        logging: this.defaultOptions.logging,
        entities: this.defaultOptions.entities,
        subscribers: this.defaultOptions.subscribers,
        migrations: this.defaultOptions.migrations
    });
  }

}
