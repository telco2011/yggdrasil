/** yggdrasil imports */
import { Server } from '@yggdrasil/mvc';

/** Application imports */
import { YggdrasilServer } from './server';

/**
 * Start yggdrasil application
 */
export const app: Promise<Server> = new YggdrasilServer().bootstrap(3000);
