import {
  Router, Bootstrap, IBootstrapRoute,
  MorganUtils, MorganRotateOptions, FileLogger,
  API
} from 'yggdrasil';

export class YggdrasilServer extends Bootstrap {

  logger: FileLogger;

  constructor() {
    super();

    this.logger = new FileLogger(YggdrasilServer.name);
  }

}
