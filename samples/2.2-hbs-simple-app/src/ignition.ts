/** yggdrasil imports */
import { IYggdrasilOptions, EViewEngine } from '@yggdrasil/startup';
import { Server } from '@yggdrasil/mvc';

/** Application imports */
import { YggdrasilServer } from './server';

const options: IYggdrasilOptions = {
  views: {
    view_engine: EViewEngine.HANDLEBARS
  }
};

/**
 * Start yggdrasil application
 */
export const app: Promise<Server> = new YggdrasilServer().bootstrap(3000, options);
