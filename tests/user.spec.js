import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import mockData from './mockData';
import app from '../src';
import userController from '../src/controllers/userController';

const { listUsers } = userController;

const API_VERSION = '/api/v1';
const LOGIN_URL = `${API_VERSION}/users/login`;
const PROFILE_URL = `${API_VERSION}/profiles`;
const endpointUser = '/api/v1/users';
const validId = '122a0d86-8b78-4bb8-b28f-8e5f7811c456';
const invalidId = '9a5f3850-c53b-4450-8ce4-d560aa2ca736';
const {
  userMock: {
    validProfileLogin, validProfile, invalidProfile1, invalidProfile2,
    invalidProfile3, getUser, invalidProfileToken: { expiredToken }
  }
} = mockData;
let authToken;

chai.use(chaiHttp);

describe('USER ROUTES', () => {
  before((done) => {
    chai.request(app)
      .post(LOGIN_URL)
      .send(validProfileLogin)
      .end((error, response) => {
        const { token } = response.body.user;
        authToken = token;
        done();
      });
  });

  describe('View user profile', () => {
    it('should be able to view a user profile', (done) => {
      chai.request(app)
        .get(`${PROFILE_URL}/${validId}`)
        .set('authorization', authToken)
        .end((error, response) => {
          expect(response).to.have.status(200);
          expect(response.body).to.be.an('object');
          expect(response.body).to.have.property('profile');
          done();
        });
    });

    it('should not be able to view a user profile if the user does exist in the database', (done) => {
      chai.request(app)
        .get(`${PROFILE_URL}/${invalidId}`)
        .set('authorization', authToken)
        .end((error, response) => {
          expect(response).to.have.status(404);
          expect(response.body).to.be.an('object');
          expect(response.body.error).to.equal('user not found');
          done();
        });
    });

    it('should not be able to view a user profile if the userId is an alphabet', (done) => {
      chai.request(app)
        .get(`${PROFILE_URL}/mklknjknljknklj`)
        .set('authorization', authToken)
        .end((error, response) => {
          expect(response).to.have.status(400);
          expect(response.body).to.be.an('object');
          expect(response.body.errors[0].message).to.equal('userId must be an UUID');
          done();
        });
    });

    it('should not be able to view a user profile if the token is missing', (done) => {
      chai.request(app)
        .get(`${PROFILE_URL}/${validId}`)
        .set('authorization', '')
        .end((error, response) => {
          expect(response).to.have.status(401);
          expect(response.body).to.be.an('object');
          done();
        });
    });

    it('should not be able to view a user profile if the token is invalid', (done) => {
      chai.request(app)
        .get(`${PROFILE_URL}/${validId}`)
        .set('authorization', '29327y37grug9')
        .end((error, response) => {
          expect(response).to.have.status(401);
          expect(response.body).to.be.an('object');
          done();
        });
    });
  });

  describe('Update user profile', () => {
    it('should be able to update a user profile', (done) => {
      chai.request(app)
        .patch(`${PROFILE_URL}`)
        .set('authorization', authToken)
        .send(validProfile)
        .end((error, response) => {
          expect(response).to.have.status(200);
          expect(response.body).to.be.an('object');
          expect(response.body.message).to.equal('profile successfully updated');
          done();
        });
    });

    it('should not be able to update a user profile if the authorization token is invalid', (done) => {
      chai.request(app)
        .patch(`${PROFILE_URL}`)
        .set('authorization', 'mklknjknljknklj')
        .send(validProfile)
        .end((error, response) => {
          expect(response).to.have.status(401);
          expect(response.body).to.be.an('object');
          done();
        });
    });

    it('should not be able to update a user profile if the authorization token is expired', (done) => {
      chai.request(app)
        .patch(`${PROFILE_URL}`)
        .set('authorization', expiredToken)
        .send(validProfile)
        .end((error, response) => {
          expect(response).to.have.status(401);
          expect(response.body).to.be.an('object');
          done();
        });
    });

    it('should not be able update a user profile if password is a parameter', (done) => {
      chai.request(app)
        .patch(`${PROFILE_URL}`)
        .set('authorization', authToken)
        .send(invalidProfile1)
        .end((error, response) => {
          expect(response).to.have.status(400);
          expect(response.body).to.be.an('object');
          done();
        });
    });

    it('should not update a user profile if request body is empty', (done) => {
      chai.request(app)
        .patch(`${PROFILE_URL}`)
        .set('authorization', authToken)
        .send({})
        .end((error, response) => {
          expect(response).to.have.status(400);
          expect(response.body).to.be.an('object');
          done();
        });
    });

    it('should not update a user profile if firstName contains invalid characters', (done) => {
      chai.request(app)
        .patch(`${PROFILE_URL}`)
        .set('authorization', authToken)
        .send(invalidProfile2)
        .end((error, response) => {
          expect(response).to.have.status(400);
          expect(response.body).to.be.an('object');
          done();
        });
    });

    it('should not update a user profile if request body contains invalid fields', (done) => {
      chai.request(app)
        .patch(`${PROFILE_URL}`)
        .set('authorization', authToken)
        .send(invalidProfile3)
        .end((error, response) => {
          expect(response).to.have.status(400);
          expect(response.body).to.be.an('object');
          done();
        });
    });

    it('should not update a user profile if authorization token is empty', (done) => {
      chai.request(app)
        .patch(`${PROFILE_URL}`)
        .set('authorization', '')
        .send({})
        .end((error, response) => {
          expect(response).to.have.status(401);
          expect(response.body).to.be.an('object');
          done();
        });
    });
  });
});

describe('Test for getting users', () => {
  before((done) => {
    const user = getUser;
    chai.request(app)
      .post(endpointUser)
      .send(user)
      .end((err, res) => {
        authToken = res.body.user.token;
        done();
      });
  });
  describe('GET /api/v1/users', () => {
    it('should get all users if user is authenticated', (done) => {
      chai.request(app)
        .get(endpointUser)
        .set('authorization', authToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('users');
          done();
        });
    });

    it('should not get all users if user is not authenticated', (done) => {
      chai.request(app)
        .get(endpointUser)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.error).to.equal('no token provided');
          done();
        });
    });

    it('should return a failure response if a server error occurs', async () => {
      try {
        await listUsers('request', 'response');
      } catch (error) {
        expect(error).to.be.an('error');
      }
    });
  });
});
