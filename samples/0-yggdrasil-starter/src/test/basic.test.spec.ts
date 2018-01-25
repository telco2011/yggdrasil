import { suite, test, YggdrasilTest } from '@yggdrasil/testing';

import { app } from '../ignition';

process.env.NODE_ENV = 'test';

@suite('Test suite')
class TestSuite extends YggdrasilTest {

  constructor() {
    super(app);
  }

  @test('should test the default yggdrasil access.')
  public testAccess(done) {
    this.chai.request(this.server)
      .get('/')
      .end((err, res) => {
        this.should.not.exist(err);
        res.should.have.status(200);
        done();
      });
  }

}
