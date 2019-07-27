import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/index';
import mockUsers from './mock_data/mock_users';

const {
  validDetails, validDetail2, duplicateEmail, duplicateUsername, correctLogin
} = mockUsers;

chai.use(chaiHttp);

const { expect } = chai;

const baseRoute = '/api/users';
const loginEndpoint = `${baseRoute}/login`;

before((done) => {
  chai.request(server)
    .post(`${baseRoute}`)
    .type('form')
    .send(validDetail2)
    .end((err) => {
      done(err);
    });
});

describe('POST /api/users', () => {
  it('should #create a user and #generate jwt', (done) => {
    chai
      .request(server)
      .post(baseRoute)
      .type('form')
      .send(validDetails)
      .end((err, res) => {
        const { user } = res.body;
        expect(res).status(201);
        expect(user).property('token');
        expect(user).property('email');
        expect(user).property('username');
        expect(user).property('bio');
        expect(user).property('image');
        done(err);
      });
  });
  it('should return error on duplicate email', (done) => {
    chai
      .request(server)
      .post(baseRoute)
      .type('form')
      .send(duplicateEmail)
      .end((err, res) => {
        expect(res).status(409);
        expect(res.body.errors).to.be.a('string');
        expect(res.body.errors).to.be.a('string').eq('user with email already exists');
        done(err);
      });
  });
  it('should return error on duplicate username', (done) => {
    chai
      .request(server)
      .post(baseRoute)
      .type('form')
      .send(duplicateUsername)
      .end((err, res) => {
        expect(res).status(409);
        expect(res.body.errors).to.be.a('string').eq('username already taken');
        done(err);
      });
  });
});


describe('POST /api/users/login', () => {
  const authErrorMessage = 'email or password is incorrect';
  it('should #login a user and #generate jwt', (done) => {
    chai
      .request(server)
      .post(loginEndpoint)
      .type('form')
      .send(correctLogin)
      .end((err, res) => {
        const { user } = res.body;
        expect(res).status(200);
        expect(user).property('token');
        expect(user).property('email');
        expect(user).property('username');
        expect(user).property('bio');
        expect(user).property('image');
        done(err);
      });
  });
  it('should return authorized error on incorrect email', (done) => {
    const incorrectEmail = { ...correctLogin };
    incorrectEmail.email = 'wrong@email.com';
    chai
      .request(server)
      .post(loginEndpoint)
      .type('form')
      .send(incorrectEmail)
      .end((err, res) => {
        expect(res).status(401);
        expect(res.body).property('errors').eq(authErrorMessage);
        done(err);
      });
  });
  it('should return authorized error on incorrect email', (done) => {
    const incorrectPassword = { ...correctLogin };
    incorrectPassword.password = 'WrongPassword';
    chai
      .request(server)
      .post(loginEndpoint)
      .type('form')
      .send(incorrectPassword)
      .end((err, res) => {
        expect(res).status(401);
        expect(res.body).property('errors').eq(authErrorMessage);
        done(err);
      });
  });
});
