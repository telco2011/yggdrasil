import { IYggdrasilRepository } from '../interfaces';
import { YggdrasilDatabaseType } from '../types';

import { DefaultRepository, MongoDBRepository } from '../../../../data';

export class YggdrasilRepositoryFactory {

  public static getRepository(type: YggdrasilDatabaseType): IYggdrasilRepository {
    switch (type) {
      case 'mongodb':
        return new MongoDBRepository();
      default:
        return new DefaultRepository();
    }
  }

}
