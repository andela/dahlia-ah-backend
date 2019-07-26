import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import server from '../../../src';
import models from '../../../src/database/models';
import testData from './mockData';

chai.use(chaiHttp);
const { expect } = chai;

const { User } = models;

const { userData } = testData;
const { forgotPasswordEmail, wrongForgotPasswordEmail } = userData;

const BASE_URL = '/api/v1/auth';
const FORGOT_PASSWORD_URL = `${BASE_URL}/forgotPassword`;

describe('AUTH', () => {
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
          expect(response.body.message).to.equal('user not found');
          done();
        });
    });

    it('should return a failure response if a server error occurs', (done) => {
      const stub = sinon.stub(User, 'findOne');
      const serverError = new Error('internal server error. we\'re working on it');
      serverError.status = 'failure';
      stub.yields(serverError);

      chai.request(server)
        .post(FORGOT_PASSWORD_URL)
        .send(forgotPasswordEmail)
        .end((error, response) => {
          expect(response).to.have.status(500);
          expect(response.body).to.be.an('object');
          expect(response.body.message).to.equal('internal server error. we\'re working on it');
          done();
        });
    });
  });
});
