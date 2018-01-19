import { suite, test } from '../../testing';

import { expect } from 'chai';

import { Utils } from './utils';

@suite('core.utils')
class UtilsTestSuite {

  @test('should test Utils.capitalize')
  public testCapitalize(done) {
    expect(Utils.capitalize('capitalize')).to.equal('Capitalize');
    done();
  }

  @test('should test Utils.getYggdrasilVersion')
  public testGetYggdrasilVersion(done) {
    const result = Utils.getYggdrasilVersion();
    expect(result).to.be.a('string');
    done();
  }

}
