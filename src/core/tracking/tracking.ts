import { v1 } from 'uuid';

export class Tracking {

  public getUUID(): string {
    return v1();
  }

}
