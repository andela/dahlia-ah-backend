import chaiHttp from 'chai-http';
import sinon from 'sinon';
import chai, { expect } from 'chai';
import mockData from './mockData';
import app from '../src';
import models from '../src/database/models';

const API_VERSION = '/api/v1';
const LOGIN_URL = `${API_VERSION}/auth/login`;
const PROFILE_URL = `${API_VERSION}/profiles`;
const REGISTER_URL = `${API_VERSION}/auth/register`;
const endpointUser = `${API_VERSION}/users`;
const validId = '122a0d86-8b78-4bb8-b28f-8e5f7811c456';
const invalidId = '9a5f3850-c53b-4450-8ce4-d560aa2ca736';

const {
  userMock: {
    validProfileLogin, validProfile, invalidProfile1, invalidProfile2,
    invalidProfile3, getUser, invalidProfileToken: { expiredToken },
    seededUser, newUserByAdmin, newUser2ByAdmin, seededSuperAdmin,
  }
} = mockData;
let authToken;
let SuperAdminToken;

const { Follower, User } = models;

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
  before((done) => {
    chai
      .request(app)
      .post(LOGIN_URL)
      .send(seededSuperAdmin)
      .end((error, response) => {
        SuperAdminToken = response.body.user.token;
        done(error);
      });
  });

  before((done) => {
    chai
      .request(app)
      .post(LOGIN_URL)
      .send(seededSuperAdmin)
      .end((error, response) => {
        SuperAdminToken = response.body.user.token;
        done(error);
      });
  });
  const seededUserId1 = '6dd5a28c-ce96-4866-b3e7-b29aa69aef97';
  const seededUserId2 = 'fb94de4d-47ff-4079-89e8-b0186c0a3be8';
  const seededUserId3 = '0ce36391-2c08-4703-bddb-a4ea8cccbbc5';
  const invalidUUID = 'fb94de4d-47ff-4079-89e8-b0186';
  const FOLLOW_URL = `${PROFILE_URL}/${seededUserId1}/follow`;

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

    describe('POST api/v1/users', () => {
      const userRoute = `${API_VERSION}/users`;
      it('should create a new user and assign role', (done) => {
        chai
          .request(app)
          .post(userRoute)
          .send(newUserByAdmin)
          .set('authorization', SuperAdminToken)
          .end((error, response) => {
            const { data } = response.body;
            expect(response).status(201);
            expect(data).property('firstName');
            expect(data).property('lastName');
            expect(data).property('email');
            done(error);
          });
      });
      it('should not create user if email already exists', (done) => {
        chai
          .request(app)
          .post(userRoute)
          .send(newUserByAdmin)
          .set('authorization', SuperAdminToken)
          .end((error, response) => {
            expect(response).status(409);
            expect(response.body).property('error').a('string').contains('already exists');
            expect();
            done(error);
          });
      });
      it('should not create user if authorized', (done) => {
        chai
          .request(app)
          .post(userRoute)
          .send(newUserByAdmin)
          .set('authorization', SuperAdminToken)
          .end((error, response) => {
            expect(response).status(409);
            expect(response.body).property('error').a('string').contains('already exists');
            expect();
            done(error);
          });
      });
      it('should return error 500 on server error', (done) => {
        const stub = sinon.stub(User, 'create');
        stub.throws(new Error('an error occurred'));
        chai
          .request(app)
          .post(userRoute)
          .send(newUser2ByAdmin)
          .set('authorization', SuperAdminToken)
          .end((error, response) => {
            expect(response).status(500);
            expect(response.body).property('error').include('an error occurred');
            stub.restore();
            done(error);
          });
      });
    });

    describe('GET api/v1/users/:userId', () => {
      const userRoute = `${API_VERSION}/users/${seededUser.id}`;

      it('should get one user', (done) => {
        chai
          .request(app)
          .get(userRoute)
          .set('authorization', SuperAdminToken)
          .end((error, response) => {
            const { data } = response.body;
            expect(response).status(200);
            expect(response.body).property('message').contains('successful');
            expect(data).property('firstName');
            expect(data).property('lastName');
            expect(data).property('email');
            expect(data).property('roleId').a('string');
            done(error);
          });
      });
    });
  });

  describe('POST/DELETE profiles/:userId/follow', () => {
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

    // ========================= FOLLOW USER ==========================
    it('should follow a user', (done) => {
      chai
        .request(app)
        .post(FOLLOW_URL)
        .set('authorization', authToken)
        .end((err, res) => {
          expect(res).status(201);
          expect(res.body).property('userId');
          done(err);
        });
    });
    it('should return error 400 if invalid UUID', (done) => {
      chai
        .request(app)
        .post(`${PROFILE_URL}/${invalidUUID}/follow`)
        .set('authorization', authToken)
        .end((err, res) => {
          expect(res).status(400);
          expect(res.body).property('error').include('invalid request');
          done(err);
        });
    });
    it('should return error 403 if a user tries to follow self', (done) => {
      chai
        .request(app)
        .post(`${PROFILE_URL}/${seededUserId2}/follow`)
        .set('authorization', authToken)
        .end((err, res) => {
          expect(res).status(403);
          expect(res.body).property('error').eql('You cannot follow yourself');
          done(err);
        });
    });
    it('should return conflict error 409 if user already followed', (done) => {
      chai
        .request(app)
        .post(FOLLOW_URL)
        .set('authorization', authToken)
        .end((err, res) => {
          expect(res).status(409);
          expect(res.body).property('error').eql("You're already a follower");
          done(err);
        });
    });

    // ========================= UNFOLLOW USER ==========================
    it('should unfollow a user', (done) => {
      chai
        .request(app)
        .delete(FOLLOW_URL)
        .set('authorization', authToken)
        .end((err, res) => {
          expect(res).status(200);
          expect(res.body).property('message').a('string').contain('successfully unfollowed');
          done(err);
        });
    });
    it('should throw error if not already followed', (done) => {
      chai
        .request(app)
        .delete(FOLLOW_URL)
        .set('authorization', authToken)
        .end((err, res) => {
          expect(res).status(403);
          expect(res.body).property('error').a('string').contain("you're not a follower");
          done(err);
        });
    });

    it('should return error 403 if a user tries to unfollow self', (done) => {
      chai
        .request(app)
        .delete(`${PROFILE_URL}/${seededUserId2}/follow`)
        .set('authorization', authToken)
        .end((err, res) => {
          expect(res).status(403);
          expect(res.body).property('error').include('not allowed');
          done(err);
        });
    });

    it('should re-follow a user', (done) => {
      chai
        .request(app)
        .post(FOLLOW_URL)
        .set('authorization', authToken)
        .end((err, res) => {
          expect(res).status(201);
          done(err);
        });
    });

    it('should return error 500 on server error on unfollow', (done) => {
      const stub = sinon.stub(Follower, 'destroy');
      stub.throws(new Error('an error occured'));

      chai
        .request(app)
        .delete(FOLLOW_URL)
        .set('authorization', authToken)
        .end((err, res) => {
          expect(res).status(500);
          stub.restore();
          done(err);
        });
    });

    it('should return error 500 on create error', (done) => {
      const stub = sinon.stub(Follower, 'create');
      stub.throws(new Error('an error occured'));

      chai
        .request(app)
        .post(`${PROFILE_URL}/${seededUserId3}/follow`)
        .set('authorization', authToken)
        .end((err, res) => {
          expect(res).status(500);
          stub.restore();
          done(err);
        });
    });
  });
});

// ================================ GET ALL USERS ====================================
describe('Test for getting users', () => {
  before((done) => {
    const user = getUser;
    chai.request(app)
      .post(REGISTER_URL)
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

    it('should get all users if search query exists', (done) => {
      chai.request(app)
        .get(`${endpointUser}?search=zen`)
        .set('authorization', authToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('users');
          done();
        });
    });

    it('should not get all users if page does not exist', (done) => {
      chai.request(app)
        .get(`${endpointUser}?page=2`)
        .set('authorization', authToken)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.error).to.equal('page not found');
          done();
        });
    });

    it('should not get all users if user is not authenticated', (done) => {
      chai.request(app)
        .get(endpointUser)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.error).to.equal('you have to be signed in to continue');
          done();
        });
    });

    it('should return server error on update', (done) => {
      const stub = sinon.stub(User, 'findAndCountAll');
      stub.throws(new Error('an error occurred'));
      chai
        .request(app)
        .get(endpointUser)
        .set('authorization', authToken)
        .end((error, response) => {
          expect(response).status(500);
          expect(response.body).property('error').include('an error occurred');
          stub.restore();
          done(error);
        });
    });
  });
});

// ================================ ADMIN GET USER ====================================
describe('GET api/v1/users/:userId', () => {
  const userRoute = `${API_VERSION}/users/${seededUser.id}`;

  it('should get one user', (done) => {
    chai
      .request(app)
      .get(userRoute)
      .set('authorization', SuperAdminToken)
      .end((error, response) => {
        const { data } = response.body;
        expect(response).status(200);
        expect(response.body).property('message').contains('successful');
        expect(data).property('firstName');
        expect(data).property('lastName');
        expect(data).property('email');
        expect(data).property('roleId').a('string');
        done(error);
      });
  });
  it('should get one user', (done) => {
    const stub = sinon.stub(User, 'findOne');
    stub.throws(new Error('an error occurred'));
    chai
      .request(app)
      .get(userRoute)
      .set('authorization', SuperAdminToken)
      .end((error, response) => {
        expect(response).status(500);
        expect(response.body).property('error').include('an error occurred');
        stub.restore();
        done(error);
      });
  });
});


// ================================ ADMIN UPDATE USER ====================================
describe('PATCH api/v1/users/:userId', () => {
  const notUserId = '5db059c3-fa2e-4e7b-873b-8c1a33c5cc0a';
  const userRoute = `${API_VERSION}/users/${seededUser.id}`;
  const notUserRoute = `${API_VERSION}/users/${notUserId}`;

  it('should update an existing user', (done) => {
    chai
      .request(app)
      .patch(userRoute)
      .send(newUserByAdmin)
      .set('authorization', SuperAdminToken)
      .end((error, response) => {
        const { data } = response.body;
        expect(response).status(200);
        expect(data).property('firstName');
        expect(data).property('lastName');
        expect(data).property('email');
        done(error);
      });
  });
  it('should return error if user does not exist', (done) => {
    chai
      .request(app)
      .patch(notUserRoute)
      .send(newUserByAdmin)
      .set('authorization', SuperAdminToken)
      .end((error, response) => {
        expect(response).status(404);
        expect(response.body).property('error').contains('not found');
        done(error);
      });
  });
  it('should return server error on update', (done) => {
    const stub = sinon.stub(User, 'update');
    stub.throws(new Error('an error occurred'));
    chai
      .request(app)
      .patch(notUserRoute)
      .send(newUserByAdmin)
      .set('authorization', SuperAdminToken)
      .end((error, response) => {
        expect(response).status(500);
        expect(response.body).property('error').include('an error occurred');
        stub.restore();
        done(error);
      });
  });
});


// ============================ SUPER-ADMIN DELETE USERS ==================================
describe('DELETE api/v1/users/:userId', () => {
  const userRoute = `${API_VERSION}/users/${seededUser.id}`;

  it('should delete a user', (done) => {
    chai
      .request(app)
      .delete(userRoute)
      .set('authorization', SuperAdminToken)
      .end((error, response) => {
        expect(response).status(200);
        expect(response.body).property('message').contains('successful');
        done(error);
      });
  });
  it('should return server error on failed delete operation', (done) => {
    const stub = sinon.stub(User, 'destroy');
    stub.throws(new Error('an error occurred'));
    chai
      .request(app)
      .delete(userRoute)
      .set('authorization', SuperAdminToken)
      .end((error, response) => {
        expect(response).status(500);
        expect(response.body).property('error').include('an error occurred');
        stub.restore();
        done(error);
      });
  });
  it('should return error if user does not exist', (done) => {
    chai
      .request(app)
      .delete(userRoute)
      .set('authorization', SuperAdminToken)
      .end((error, response) => {
        expect(response).status(404);
        expect(response.body).property('error').contains('not found');
        done(error);
      });
  });
});

// Update user settings

describe('UPDATE api/v1/users/setting?allowEmailNotification=false', () => {
  const settings = `${API_VERSION}/users/setting?allowEmailNotification=true`;
  const invalidUrl = `${API_VERSION}/users/setting?allowEmailNotification=ben`;

  it('should allow user notification', (done) => {
    chai
      .request(app)
      .patch(settings)
      .set('authorization', SuperAdminToken)
      .end((error, response) => {
        expect(response).status(200);
        expect(response.body).property('message').contains('settings was updated successfully');
        done(error);
      });
  });
  it('should return server error on failed update operation', (done) => {
    const stub = sinon.stub(User, 'update');
    stub.throws(new Error('an error occurred'));
    chai
      .request(app)
      .patch(settings)
      .set('authorization', SuperAdminToken)
      .end((error, response) => {
        expect(response).status(500);
        expect(response.body).property('error').include('an error occurred');
        stub.restore();
        done(error);
      });
  });
  it('should return error if query is invalid', (done) => {
    chai
      .request(app)
      .patch(invalidUrl)
      .set('authorization', SuperAdminToken)
      .end((error, response) => {
        expect(response).status(400);
        done(error);
      });
  });
});
