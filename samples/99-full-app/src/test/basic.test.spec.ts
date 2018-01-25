import { suite, test, YggdrasilTest } from '@yggdrasil/testing';

import { app } from '../ignition';

process.env.NODE_ENV = 'test';

@suite('Basic tests')
class BasicTestSuite extends YggdrasilTest {

  constructor() {
    super(app);
  }

  @test('should test get hello world response')
  public testGetHelloWorld(done) {
    this.chai.request(this.server)
      .get('/api/basic')
      .end((err, res) => {
        this.should.not.exist(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.a.property('method');
        res.body.method.should.be.equal('GET');
        done();
      });
  }

  @test('should test post hello world response')
  public testPostHelloWorld(done) {
    this.chai.request(this.server)
      .post('/api/basic')
      .end((err, res) => {
        this.should.not.exist(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.a.property('method');
        res.body.method.should.be.equal('POST');
        done();
      });
  }

  @test('should test put hello world response')
  public testPutHelloWorld(done) {
    this.chai.request(this.server)
      .put('/api/basic')
      .end((err, res) => {
        this.should.not.exist(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.a.property('method');
        res.body.method.should.be.equal('PUT');
        done();
      });
  }

  @test('should test delete hello world response')
  public testDeleteHelloWorld(done) {
    this.chai.request(this.server)
      .delete('/api/basic')
      .end((err, res) => {
        this.should.not.exist(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.a.property('method');
        res.body.method.should.be.equal('DELETE');
        done();
      });
  }
}
