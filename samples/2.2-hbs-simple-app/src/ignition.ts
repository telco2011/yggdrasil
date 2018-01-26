/** yggdrasil imports */
import { IYggdrasilOptions, EViewEngine } from '@yggdrasil/startup';
import { Server } from '@yggdrasil/mvc';

/** Application imports */
import { YggdrasilServer } from './server';
import * as hbs from 'hbs';

const options: IYggdrasilOptions = {
  views: {
    view_engine: EViewEngine.HANDLEBARS
  }
};

// TODO: Review and transform to typescript code
hbs.registerPartials('dist/views/partials');
const blocks = {};

hbs.registerHelper('extend', (name, context) => {
  let block = blocks[name];
  if (!block) {
    block = blocks[name] = [];
  }

  block.push(context.fn(this));
});
hbs.registerHelper('block', (name) => {
  const val = (blocks[name] || []).join('\n');

  blocks[name] = [];
  return val;
});

/**
 * Start yggdrasil application
 */
export const app: Promise<Server> = new YggdrasilServer().bootstrap(3000, options);
