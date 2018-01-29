import { YggdrasilRepository, YggdrasilDefaultRepository } from '../classes';
import { YggdrasilDatabaseType } from '../types';

export abstract class YggdrasilRepositoryFactory {
  public static getRepository(type: YggdrasilDatabaseType): YggdrasilRepository {
    return new YggdrasilDefaultRepository();
  }
}
