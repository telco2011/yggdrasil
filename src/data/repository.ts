import { Connection, ConnectionOptions, EntityManager } from 'typeorm';

import { FileLogger } from '../core';

export abstract class Repository {

  public abstract logger: FileLogger;

  public abstract defaultOptions: ConnectionOptions;
  public abstract connection: Connection;
  public abstract manager: EntityManager;

  public abstract getManager(): EntityManager;

  public abstract async createConnection(options?: ConnectionOptions);

}
