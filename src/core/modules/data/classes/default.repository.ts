import { FileLogger } from '../../../logger';

import { IYggdrasilRepository } from '../interfaces';
import { YggdrasilConnectionOptions } from '../types';

export class YggdrasilDefaultRepository implements IYggdrasilRepository {

  public logger: FileLogger;

  constructor() {
    this.logger = new FileLogger(YggdrasilDefaultRepository.name);
  }

  public async createConnection(options?: YggdrasilConnectionOptions) {
    await this.logger.info(YggdrasilDefaultRepository.name);
  }

}
