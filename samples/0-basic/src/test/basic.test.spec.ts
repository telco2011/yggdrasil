import { suite, test, slow, timeout, YggdrasilTest } from '@yggdrasil/testing';

import { app } from '../ignition';

process.env.NODE_ENV = 'test';

@suite('Basic tests')
class BasicTestSuite extends YggdrasilTest {

  constructor() {
    super(app);
  }

  @test('should be a hello world response')
  public testHelloWorld(done) {
    this.chai.request(this.server)
      .get('/api/basic')
      .end((err, res) => {
        this.should.not.exist(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.a.property('data');
        done();
      });
  }

}
