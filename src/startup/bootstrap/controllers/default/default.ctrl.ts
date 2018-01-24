import { Request, Response } from '../../../../mvc';
import { FileLogger } from '../../../../core';

export class DefaultCtrl {

  /** BasicCtrl logger */
  private logger: FileLogger;

  /** Default constructor */
  constructor() {
    this.logger = new FileLogger(DefaultCtrl.name);
  }

  public getDefault = (req: Request, res: Response) => {
    this.logger.debug(`getDefault response.`);

    res.sendFile(__dirname + '/default.html');
  }

}
