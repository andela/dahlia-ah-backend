import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import sendgridMail from '@sendgrid/mail';
import server from '../src';
import mockData from './mockData';
import models from '../src/database/models';

chai.use(chaiHttp);
const { expect } = chai;

dotenv.config();

const { SECRET_KEY } = process.env;

const { userMock } = mockData;
const {
  forgotPasswordEmail, wrongForgotPasswordEmail,
  wrongCurrentPassword, sameCurentAndNewPassword,
  validChangePasswordInput, usingPreviousPassword,
  userWithoutPreviousPassword, withoutFivePreviousPassword
} = userMock;

const { BlacklistedToken } = models;

const BASE_URL = '/api/v1';
const FORGOT_PASSWORD_URL = `${BASE_URL}/auth/forgotPassword`;
const CHANGE_PASSWORD_URL = `${BASE_URL}/auth/changepassword`;

// token of loggedIn user Richard Croft in the database
const loggedInUserToken = jwt.sign({ id: '11fb0350-5b46-4ace-9a5b-e3b788167915' }, SECRET_KEY, { expiresIn: '60s' });

// token of loggedIn user Williams Brook in the database
const loggedInUser2Token = jwt.sign({ id: '8f3e7eda-090a-4c44-9ffe-58443de5e1f8' }, SECRET_KEY, { expiresIn: '60s' });

// token of loggedIn user Bruce Clifford in the database
const loggedInUser3Token = jwt.sign({ id: '8487ef08-2ac2-4387-8bd6-738b12c75dff' }, SECRET_KEY, { expiresIn: '60s' });
const SIGN_OUT_URL = `${BASE_URL}/auth`;

const logoutToken = jwt.sign({ id: '122a0d86-8b78-4bb8-b28f-8e5f7811c456' }, process.env.SECRET_KEY, { expiresIn: '60 minutes' });
const logoutTokenTwo = jwt.sign({ id: 'ce87299b-0dfa-44ed-bb53-45d434647eb2' }, process.env.SECRET_KEY, { expiresIn: '60 minutes' });

describe('AUTH', () => {
  describe('POST /auth/register', () => {
    const signupEndpoint = `${BASE_URL}/auth/register`;
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
  });

  describe('POST /api/users/login', () => {
    const loginsignupEndpoint = `${BASE_URL}/auth/login`;
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
    it('should return error if password id not correct', (done) => {
      chai
        .request(server)
        .post(loginsignupEndpoint)
        .type('form')
        .send(userMock.seededUser2)
        .end((err, res) => {
          expect(res).status(401);
          expect(res.body).property('errors').eq('email or password is incorrect');
          done(err);
        });
    });
    it('should return error if user is not verified', (done) => {
      chai
        .request(server)
        .post(loginsignupEndpoint)
        .type('form')
        .send(userMock.validUser2)
        .end((err, res) => {
          expect(res).status(401);
          expect(res.body).property('errors').eq('please verify your email');
          done(err);
        });
    });
  });

  // Forgot password route
  describe('Forgot password', () => {
    it('should sucessfully return an appropiate message after sending a mail to the user', (done) => {
      const stub = sinon.stub(sendgridMail, 'send');
      stub.returns({ message: 'you will receive a link in your mail shortly' });

      chai.request(server)
        .post(FORGOT_PASSWORD_URL)
        .send(forgotPasswordEmail)
        .end((error, response) => {
          expect(response).to.have.status(200);
          expect(response.body).to.be.an('object');
          expect(response.body.message).to.equal('you will receive a link in your mail shortly');
          stub.restore();
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
      const stub = sinon.stub(jwt, 'sign');
      stub.throws(new Error('error occured!'));

      chai.request(server)
        .post(FORGOT_PASSWORD_URL)
        .send(forgotPasswordEmail)
        .end((error, response) => {
          expect(response).to.have.status(500);
          expect(response.body).to.be.an('object');
          expect(response.body.error).to.equal('error occured!');
          stub.restore();
          done();
        });
    });
  });

  // Change Password route
  describe('Change password', () => {
    it('should sucessfully change a user\'s password', (done) => {
      chai.request(server)
        .post(CHANGE_PASSWORD_URL)
        .send(validChangePasswordInput)
        .set('authorization', loggedInUserToken)
        .end((error, response) => {
          expect(response).to.have.status(200);
          expect(response.body).to.be.an('object');
          expect(response.body.message).to.equal('successfully changed password');
          done();
        });
    });

    it('should sucessfully change a user\'s password who doesn\'t have a previous password', (done) => {
      chai.request(server)
        .post(CHANGE_PASSWORD_URL)
        .send(userWithoutPreviousPassword)
        .set('authorization', loggedInUser2Token)
        .end((error, response) => {
          expect(response).to.have.status(200);
          expect(response.body).to.be.an('object');
          expect(response.body.message).to.equal('successfully changed password');
          done();
        });
    });

    it('should sucessfully change a user\'s password who doesn\'t have up to 5 previous passwords', (done) => {
      chai.request(server)
        .post(CHANGE_PASSWORD_URL)
        .send(withoutFivePreviousPassword)
        .set('authorization', loggedInUser3Token)
        .end((error, response) => {
          expect(response).to.have.status(200);
          expect(response.body).to.be.an('object');
          expect(response.body.message).to.equal('successfully changed password');
          done();
        });
    });

    it('should return a failure response if the currentPassword supplied is wrong', (done) => {
      chai.request(server)
        .post(CHANGE_PASSWORD_URL)
        .send(wrongCurrentPassword)
        .set('authorization', loggedInUserToken)
        .end((error, response) => {
          expect(response).to.have.status(403);
          expect(response.body).to.be.an('object');
          expect(response.body.error).to.equal('wrong password');
          done();
        });
    });

    it('should return a failure response if newPassword is same as currentPassword', (done) => {
      chai.request(server)
        .post(CHANGE_PASSWORD_URL)
        .send(sameCurentAndNewPassword)
        .set('authorization', loggedInUserToken)
        .end((error, response) => {
          expect(response).to.have.status(409);
          expect(response.body).to.be.an('object');
          expect(response.body.error).to.equal('new password cannot be the same the current password');
          done();
        });
    });

    it('should return a failure response if newPassword is same as any of the last 5 passwords', (done) => {
      chai.request(server)
        .post(CHANGE_PASSWORD_URL)
        .send(usingPreviousPassword)
        .set('authorization', loggedInUserToken)
        .end((error, response) => {
          expect(response).to.have.status(409);
          expect(response.body).to.be.an('object');
          expect(response.body.error).to.equal('you cannot use any of your last 5 passwords');
          done();
        });
    });

    it('should return a failure response if a server error occurs', (done) => {
      const stub = sinon.stub(bcrypt, 'compare');
      stub.throws(new Error('error occured!'));

      chai.request(server)
        .post(CHANGE_PASSWORD_URL)
        .send(validChangePasswordInput)
        .set('authorization', loggedInUserToken)
        .end((error, response) => {
          expect(response).to.have.status(500);
          expect(response.body).to.be.an('object');
          expect(response.body.error).to.equal('error occured!');
          stub.restore();
          done();
        });
    });
  });
});

describe('POST /api/v1/auth/login', () => {
  const loginsignupEndpoint = `${BASE_URL}/auth/login`;
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
  it('should return error if password id not correct', (done) => {
    chai
      .request(server)
      .post(loginsignupEndpoint)
      .type('form')
      .send(userMock.seededUser2)
      .end((err, res) => {
        expect(res).status(401);
        expect(res.body).property('errors').eq('email or password is incorrect');
        done(err);
      });
  });
  it('should return error if user is not verified', (done) => {
    chai
      .request(server)
      .post(loginsignupEndpoint)
      .type('form')
      .send(userMock.validUser2)
      .end((err, res) => {
        expect(res).status(401);
        expect(res.body).property('errors').eq('please verify your email');
        done(err);
      });
  });
});

// Logout route
describe('GET api/v1/auth/logout', () => {
  it('should return a 401 error accessing the logout route without a token', (done) => {
    chai
      .request(server)
      .get(`${SIGN_OUT_URL}/logout`)
      .end((err, res) => {
        expect(res).status(401);
        expect(res.body.error)
          .to.eql('you have to be signed in to continue');
        done();
      });
  });

  it('should be able to logout successfully and return a status code of 200', (done) => {
    chai
      .request(server)
      .get(`${SIGN_OUT_URL}/logout`)
      .set('Authorization', `${logoutToken}`)
      .end((err, res) => {
        expect(res).status(200);
        expect(res.body)
          .to.be.a('object');
        expect(res.body.message)
          .to.eql('Logout was successful');
        done();
      });
  });

  it('should not be allowed to sign in if token is blacklisted', (done) => {
    chai
      .request(server)
      .get(`${SIGN_OUT_URL}/logout`)
      .set('Authorization', `${logoutToken}`)
      .end((err, res) => {
        expect(res).status(401);
        expect(res.body)
          .to.be.a('object');
        expect(res.body.error)
          .to.eql('invalid token');
        done();
      });
  });

  it('should return a failure response if a server error occurs', (done) => {
    const stub = sinon.stub(BlacklistedToken, 'create');
    stub.throws(new Error('error occurred!'));

    chai.request(server)
      .get(`${SIGN_OUT_URL}/logout`)
      .set('Authorization', `${logoutTokenTwo}`)
      .end((error, response) => {
        expect(response).to.have.status(500);
        expect(response.body).to.be.an('object');
        expect(response.body.error).to.equal('Something went wrong');
        stub.restore();
        done();
      });
  });
});

describe('POST /api/v1/auth/login', () => {
  const loginsignupEndpoint = `${BASE_URL}/auth/login`;
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
  it('should return error if password id not correct', (done) => {
    chai
      .request(server)
      .post(loginsignupEndpoint)
      .type('form')
      .send(userMock.seededUser2)
      .end((err, res) => {
        expect(res).status(401);
        expect(res.body).property('errors').eq('email or password is incorrect');
        done(err);
      });
  });
  it('should return error if user is not verified', (done) => {
    chai
      .request(server)
      .post(loginsignupEndpoint)
      .type('form')
      .send(userMock.validUser2)
      .end((err, res) => {
        expect(res).status(401);
        expect(res.body).property('errors').eq('please verify your email');
        done(err);
      });
  });
});
