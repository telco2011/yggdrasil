import * as fs from 'fs';
import * as path from 'path';
import * as appRoot from 'app-root-path';

/**
 * Gives utils functionality for all backend.
 */
export class Utils {

  /**
   * Contains the application root path
   */
  public static appRootPath: string = appRoot.path;

  /**
   * Contains the application logs path
   */
  public static appLogsPath: string = appRoot.path + '/logs';

  /**
   * Contains the yggdrasil module path
   */
  public static yggdrasilRootPath: string = appRoot.path + '/node_modules/@yggdrasil';

  /**
   * Capitalise the given string
   *
   * @param data String to capitalise
   */
  public static capitalize(data: string): string {
    return data.replace(/\b(\w)/g, s => s.toUpperCase());
  }

  /**
   * Gets @yggdrasil version
   *
   * @return @yggdrasil version
   */
  public static getYggdrasilVersion(): string {
    // TODO: Waiting for oficial package.json schema to change type
    const pkg: any = JSON.parse(fs.readFileSync(Utils.yggdrasilRootPath + '/core/package.json', 'utf-8'));
    return pkg.version;
  }
}
