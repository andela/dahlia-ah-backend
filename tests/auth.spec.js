import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/index';
import mockUser from './mockData/mockUser';

chai.use(chaiHttp);

const { expect } = chai;

const endpoint = '/api/v1/users';

describe('POST /auth/signup', () => {
  it('should #create a user and #generate jwt', (done) => {
    chai
      .request(server)
      .post(endpoint)
      .type('form')
      .send(mockUser.validUser2)
      .end((err, res) => {
        const { user } = res.body;
        expect(user).property('token');
        expect(user).property('email');
        expect(user).property('username');
        expect(user).property('bio');
        done(err);
      });
  });
  it('should return error on duplicate email', (done) => {
    chai
      .request(server)
      .post(endpoint)
      .type('form')
      .send(mockUser.duplicateEmail)
      .end((err, res) => {
        const errorArray = res.body.errors[0];
        expect(res).status(409);
        expect(res.body.errors).to.be.an('array');
        expect(errorArray).to.be.an('object');
        expect(errorArray).property('field').eq('email');
        expect(errorArray).property('message').eq('user with email already exists');
        done(err);
      });
  });
  it('should return error on duplicate username', (done) => {
    chai
      .request(server)
      .post(endpoint)
      .type('form')
      .send(mockUser.duplicateUsername)
      .end((err, res) => {
        const errorArray = res.body.errors[0];
        expect(res).status(409);
        expect(res.body.errors).to.be.an('array');
        expect(errorArray).to.be.an('object');
        expect(errorArray).property('field').eq('username');
        expect(errorArray).property('message').eq('username already taken');
        done(err);
      });
  });
});
