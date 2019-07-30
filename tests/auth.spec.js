import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import server from '../src';
import models from '../src/database/models';
import mockData from './mockData';

chai.use(chaiHttp);
const { expect } = chai;

const { User } = models;
const { userMock } = mockData;
const { forgotPasswordEmail, wrongForgotPasswordEmail } = userMock;

const BASE_URL = '/api/v1';
const endpoint = `${BASE_URL}/users`;
const FORGOT_PASSWORD_URL = `${BASE_URL}/auth/forgotPassword`;

describe('AUTH', () => {
  describe('POST /auth/signup', () => {
    it('should #create a user and #generate jwt', (done) => {
      chai
        .request(server)
        .post(endpoint)
        .type('form')
        .send(userMock.validUser2)
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
        .send(userMock.duplicateEmail)
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
        .send(userMock.duplicateUsername)
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

  // Forgot password route
  describe('Forgot password', () => {
    it('should sucessfully return an appropiate message after sending a mail to the user', (done) => {
      chai.request(server)
        .post(FORGOT_PASSWORD_URL)
        .send(forgotPasswordEmail)
        .end((error, response) => {
          expect(response).to.have.status(200);
          expect(response.body).to.be.an('object');
          expect(response.body.message).to.equal('you will receive a link in your mail shortly');
          done();
        });
    });

    it('should return a failure response if the user is not in the database', (done) => {
      chai.request(server)
        .post(FORGOT_PASSWORD_URL)
        .send(wrongForgotPasswordEmail)
        .end((error, response) => {
          expect(response).to.have.status(404);
          expect(response.body).to.be.an('object');
          expect(response.body.error).to.equal('user not found');
          done();
        });
    });

    it('should return a failure response if a server error occurs', (done) => {
      const stub = sinon.stub(User, 'findOne');
      stub.throws(new Error('error occured!'));

      chai.request(server)
        .post(FORGOT_PASSWORD_URL)
        .send(forgotPasswordEmail)
        .end((error, response) => {
          expect(response).to.have.status(500);
          expect(response.body).to.be.an('object');
          expect(response.body.error).to.equal('error occured!');
          done();
        });
    });
  });
});
