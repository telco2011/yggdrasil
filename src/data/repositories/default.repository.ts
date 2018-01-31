import { FileLogger } from '../../core';
import { YggdrasilRepository } from '../repository';
import { IYggdrasilRepository } from '../../core/modules/data/interfaces';

import { Connection, ConnectionOptions, EntityManager } from 'typeorm';

export class DefaultRepository extends YggdrasilRepository implements IYggdrasilRepository {

  public logger: FileLogger;

  public connection: Connection;

  public manager: EntityManager;

  constructor() {
    super();
    this.logger = new FileLogger(DefaultRepository.name);
  }

  public getManager(): EntityManager {
    return this.manager;
  }

  public async createConnection(options?: ConnectionOptions) {
    this.logger.info(`Create connection for ${DefaultRepository.name}`);
  }

}
