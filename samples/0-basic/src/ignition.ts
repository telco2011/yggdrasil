import { Server } from '@yggdrasil/mvc';
import { YggdrasilServer } from './server';

/**
 * Start Express server.
 */
export const server: Promise<Server> = new YggdrasilServer().bootstrap(3000);