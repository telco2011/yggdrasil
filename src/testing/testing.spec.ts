import { suite, test } from '../testing';

import { expect, assert } from 'chai';

@suite('testing')
class TestingTestSuite {

  @test()
  public notYetImplemented(done) {
    assert.fail();
    done();
  }

}
