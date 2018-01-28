import { Connection, createConnection, getConnection } from 'typeorm';

export class MongoDBRepository {

  private connection: Connection;

  constructor() {
    this.createConnection();
  }

  public getConnection(): Connection {
    return getConnection();
  }

  private async createConnection() {
    this.connection = await createConnection();
  }

}
