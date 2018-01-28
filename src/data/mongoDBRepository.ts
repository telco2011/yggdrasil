import { Connection, MongoEntityManager, createConnection, getConnection, getMongoManager } from 'typeorm';

export class MongoDBRepository {

  private connection: Connection;
  private manager: MongoEntityManager;

  public getConnection(): Connection {
    return getConnection();
  }

  public getManager(): MongoEntityManager {
    return getMongoManager();
  }

  public async createConnection() {
    this.connection = await createConnection({
        type: "mongodb",
        host: "localhost",
        port: 27017,
        database: "yggdrasil"
    });
  }

}
