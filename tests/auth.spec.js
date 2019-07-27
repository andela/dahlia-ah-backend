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
const FORGOT_PASSWORD_URL = `${BASE_URL}/auth/forgotPassword`;


describe('AUTH', () => {
  describe('POST /auth/signup', () => {
    const signupEndpoint = `${BASE_URL}/users`;
    it('should #create a user and #generate jwt', (done) => {
      chai
        .request(server)
        .post(signupEndpoint)
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
        .post(signupEndpoint)
        .type('form')
        .send(userMock.duplicateEmail)
        .end((err, res) => {
          const { errors } = res.body;
          expect(res).status(409);
          expect(errors).eq('user with email already exists');
          done(err);
        });
    });
    it('should return error on duplicate username', (done) => {
      chai
        .request(server)
        .post(signupEndpoint)
        .type('form')
        .send(userMock.duplicateUsername)
        .end((err, res) => {
          const { errors } = res.body;
          expect(res).status(409);
          expect(errors).eq('username already taken');
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
          stub.restore();
          expect(response.body).to.be.an('object');
          expect(response.body.error).to.equal('error occured!');
          done();
        });
    });
  });
});

describe('POST /api/users/login', () => {
  const signupEndpoint = `${BASE_URL}/users`;
  const loginsignupEndpoint = `${BASE_URL}/users/login`;
  before((done) => {
    chai.request(server)
      .post(`${signupEndpoint}`)
      .type('form')
      .send(userMock.validUser)
      .end((err) => {
        done(err);
      });
  });
  const authErrorMessage = 'email or password is incorrect';
  it('should #login a user and #generate jwt', (done) => {
    chai
      .request(server)
      .post(loginsignupEndpoint)
      .type('form')
      .send(userMock.seededUser1)
      .end((err, res) => {
        const { user } = res.body;
        expect(res).status(200);
        expect(user).property('token');
        expect(user).property('email');
        expect(user).property('username');
        expect(user).property('bio');
        done(err);
      });
  });
  it('should return authorized error on incorrect email', (done) => {
    const incorrectEmail = { ...userMock.validUser };
    incorrectEmail.email = 'wrong@email.com';
    chai
      .request(server)
      .post(loginsignupEndpoint)
      .type('form')
      .send(incorrectEmail)
      .end((err, res) => {
        expect(res).status(401);
        expect(res.body).property('errors').eq(authErrorMessage);
        done(err);
      });
  });
  it('should return authorized error on incorrect email', (done) => {
    const incorrectPassword = { ...userMock.validUser };
    incorrectPassword.password = 'WrongPassword1';
    chai
      .request(server)
      .post(loginsignupEndpoint)
      .type('form')
      .send(incorrectPassword)
      .end((err, res) => {
        expect(res).status(401);
        expect(res.body).property('errors').eq(authErrorMessage);
        done(err);
      });
  });
});