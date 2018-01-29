import * as requireENV from 'require-env';
import chalk from 'chalk';

export class Startup {
  private checkENV = requireENV;
  private messages;
  // TODO: Review this tslint
  // tslint:disable-next-line
  private optionalENVs: Array<string>;
  // TODO: Review this tslint
  // tslint:disable-next-line
  private requiredENVs: Array<string>;

  // TODO: Review this tslint
  // tslint:disable-next-line
  constructor(requiredENVs: Array<string>, optionalENVs: Array<string>, envFile?: string) {
    if (!requiredENVs) {
      console.error(`${chalk.red('error:')} The requiredENV array is needed to check the startup.`);
      throw new Error();
    }
    this.messages = {
      errors: [],
      warnings: []
    };
    if (envFile) { this.checkENV.inherit(envFile); }
    this.requiredENVs = requiredENVs;
    this.optionalENVs = optionalENVs;
  }

  public startupCheck = async () => {
    return new Promise((resolve, reject) => {
      let resolutionMessage = `${chalk.green('info:')} ENV is correct. Start to load the server.`;
      const requireCheck = this.checkRequiredENVs();
      const optionalCheck = this.checkOptionalENVs();

      if (this.messages.warnings.length > 0) {
        for (const warn of this.messages.warnings) {
          console.log(`${chalk.yellow('warn:')} ${warn}`);
        }
        resolutionMessage = `${chalk.yellow('warn:')} Start to load the server with some ENV warnings.`;
      }
      if (this.messages.errors.length > 0) {
        for (const error of this.messages.errors) {
          console.log(`${chalk.red('error:')} ${error}`);
        }
        console.log(`${chalk.red('error:')} Stop to load the server due to some ENV errors.`);
        process.exit(1);
      }

      console.log(resolutionMessage);
      resolve();
    });
  }

  private checkRequiredENVs = async () => {
    return new Promise((resolve, reject) => {
      for (const prop of this.requiredENVs) {
        try {
          this.checkENV.require(prop);
        } catch (error) {
          this.messages.errors.push(error.message);
        }
      }
      resolve();
    });
  }

  private checkOptionalENVs = async () => {
    return new Promise((resolve, reject) => {
      for (const prop of this.optionalENVs) {
        try {
          this.checkENV.require(prop);
        } catch (error) {
          this.messages.warnings.push(error.message);
        }
      }
      resolve();
    });
  }

}
