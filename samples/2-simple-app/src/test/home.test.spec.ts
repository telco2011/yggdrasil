import { suite, test, YggdrasilTest } from '@yggdrasil/testing';

import { app } from '../ignition';

process.env.NODE_ENV = 'test';

@suite('Home tests')
class HomeTestsSuite extends YggdrasilTest {

  constructor() {
    super(app);
  }

}
