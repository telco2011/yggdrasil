import { v1 } from 'uuid';

export class Tracking {

  public static trackingId: string;

  public static getUUID = (): string => {
    Tracking.trackingId = v1();
    return Tracking.trackingId;
  }

}
