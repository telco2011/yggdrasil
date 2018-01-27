import { suite, test } from '../../testing';

import { expect } from 'chai';

import { Tracking } from './tracking';

@suite('core.tracking')
class TrackingTestSuite {

  @test('should test Tracking.getUUID')
  public testGetUUID(done) {
    const uuid = Tracking.getUUID();
    expect(uuid).to.be.a('string');
    const otherUuid = Tracking.getUUID();
    expect(otherUuid).to.not.equal(uuid);
    done();
  }

}
