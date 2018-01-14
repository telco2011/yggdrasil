import { suite, test, slow, timeout } from 'mocha-typescript';
import * as chai from 'chai';
import * as chaiHttp from 'chai-http';

process.env.NODE_ENV = 'test';
import { app } from '../ignition';

@suite('Basic tests')
class BasicTestSuite {

  private should = chai.use(chaiHttp).should();
  private testApp;

  before(done) {
    this.testApp = app;
    setTimeout(() => {
      done();
    }, 1800);
  }

  @test('should be a hello world response')
  public testHelloWorld (done) {
    chai.request('http://localhost:3000')
      .get('/api/basic')
      .end((err, res) => {
        this.should.not.exist(err);
        res.should.have.status(200);
        done();
      });
  }

}
