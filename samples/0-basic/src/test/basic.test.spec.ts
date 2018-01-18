import { suite, test, slow, timeout } from 'mocha-typescript';
import * as chai from 'chai';
import * as chaiHttp from 'chai-http';

process.env.NODE_ENV = 'test';
import { app } from '../ignition';

@suite('Basic tests')
class BasicTestSuite {

  private should = chai.use(chaiHttp).should();
  private server;

  public before(done) {
    const that = this;
    Promise.resolve(app).then(server => {
      that.server = server;
      done();
    });
  }

  @test('should be a hello world response')
  public testHelloWorld(done) {
    chai.request(this.server)
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
