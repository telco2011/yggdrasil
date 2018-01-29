import { FileLogger } from '../../../logger';

import { YggdrasilConnectionOptions } from '../types';

export abstract class YggdrasilRepository {

  public abstract logger: FileLogger;

  public abstract async createConnection(options?: YggdrasilConnectionOptions);

}
