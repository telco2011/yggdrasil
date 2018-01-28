import { Connection, createConnection, getConnection } from 'typeorm';

export class MongoDBRepository {

  private connection: Connection;

  public getConnection(): Connection {
    return getConnection();
  }

  public async createConnection() {
    this.connection = await createConnection();
  }

}
