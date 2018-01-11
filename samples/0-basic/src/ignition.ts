import { Server } from '@yggdrasil/api';
import { YggdrasilServer } from './server';

/**
 * Start Express server.
 */
export const server: Server = new YggdrasilServer().bootstrap(3000);
