import { Bootstrap, IBootstrapRoute } from '@yggdrasil/startup';
import { FileLogger } from '@yggdrasil/logger';

export class YggdrasilServer extends Bootstrap {

  logger: FileLogger;

  constructor() {
    super();

    this.logger = new FileLogger(YggdrasilServer.name);
  }

}
