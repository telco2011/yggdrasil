import { YggdrasilRepositoryFactory } from '../core/modules/data/factories';
import { YggdrasilRepository } from '../core/modules/data/classes';
import { YggdrasilDatabaseType } from '../core/modules/data/types';

import { Repository } from './repository';
import { MongoDBRepository } from './repositories';

import { ConnectionOptions } from 'typeorm';

export class RepositoryFactory extends YggdrasilRepositoryFactory {

  public static getRepository(type: YggdrasilDatabaseType): YggdrasilRepository {
    switch (type) {
      case 'mongodb':
      default:
        return new MongoDBRepository();
    }
  }

}
