import { ConnectionOptions } from 'typeorm';

import { Repository } from './repository';
import { MongoDBRepository } from './repositories';

export class YggdrasilRepositoryFactory {
  public static getRepository(options: ConnectionOptions): Repository {
    switch (options.type) {
      case 'mongodb':
      default:
        return new MongoDBRepository();
    }
  }
}
