import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/index';
import mockData from './mockData';

chai.use(chaiHttp);

const { expect } = chai;
const { userMock, novelMock } = mockData;

let authToken, authReaderToken;

const endpointUser = '/api/v1/users/login';
const endpointNovel = '/api/v1/novels';

describe('Test for novel CRUD', () => {
  before((done) => {
    const user = userMock.seededUser1;
    chai.request(server)
      .post(endpointUser)
      .send(user)
      .end((err, res) => {
        authToken = res.body.user.token;
        done();
      });
  });

  before((done) => {
    const reader = userMock.validReaderProfileLogin;
    chai.request(server)
      .post(endpointUser)
      .send(reader)
      .end((err, res) => {
        authReaderToken = res.body.user.token;
        done();
      });
  });
  describe('POST /api/v1/novels', () => {
    it('should create novel if all fields are valid', (done) => {
      chai.request(server)
        .post(endpointNovel)
        .send(novelMock.validNovel)
        .set('authorization', authToken)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('novel');
          done();
        });
    });

    it('should not create novel if user does not have required permission', (done) => {
      chai.request(server)
        .post(endpointNovel)
        .send(novelMock.validNovel)
        .set('authorization', authReaderToken)
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body.error).to.have.equal('you need permission');
          done();
        });
    });

    it('should not create novel if user has a novel with the same title', (done) => {
      chai.request(server)
        .post(endpointNovel)
        .send(novelMock.validNovel)
        .set('authorization', authToken)
        .end((err, res) => {
          expect(res).to.have.status(409);
          expect(res.body.errors).to.have.equal('You already have a novel with this title');
          done();
        });
    });

    it('should not create novel if user is not logged in', (done) => {
      chai.request(server)
        .post(endpointNovel)
        .send(novelMock.validNovel)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.error).to.equal('no token provided');
          done();
        });
    });

    it('should not create novel if user token is wrong', (done) => {
      chai.request(server)
        .post(endpointNovel)
        .send(novelMock.validNovel)
        .set('authorization', 'wrong token')
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.error).to.equal('invalid token');
          done();
        });
    });
  });
});
