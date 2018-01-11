import { Server } from 'yggdrasil';
import { YggdrasilServer } from './server';

/**
 * Start Express server.
 */
export const server: Server = new YggdrasilServer().bootstrap(3000);
