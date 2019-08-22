import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src';

chai.use(chaiHttp);

const { expect } = chai;

const url = '/';

describe('Test for base api base url', () => {
  it('should return a status code of 200', (done) => {
    chai.request(app)
      .get(url)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});

describe('Test for endpoint not found(404)', () => {
  it('should return a status code of 404 when the endpoint supplied is not on our server', (done) => {
    chai.request(app)
      .get('/404/error/hi')
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
});
