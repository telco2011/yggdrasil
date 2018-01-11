import * as path from 'path';
import * as appRoot from 'app-root-path';

/**
 * Gives utils functionality for all backend.
 */
export class Utils {

  /**
   * Contains the application root path
   */
  static appRootPath: string = appRoot.path;

  /**
   * Contains the application logs path
   */
  static appLogsPath: string = appRoot.path + '/logs';

  static capitalize(data: string): string {
    return data.replace(/\b(\w)/g, s => s.toUpperCase());
  }
}
