import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/index';
import mockData from './mockData';

chai.use(chaiHttp);

const { expect } = chai;
const { userMock, novelMock } = mockData;

let authToken;

const endpointUser = '/api/v1/users';
const endpointNovel = '/api/v1/novels';

describe('Test for novel CRUD', () => {
  before((done) => {
    const user = userMock.novelUser;
    chai.request(server)
      .post(endpointUser)
      .send(user)
      .end((err, res) => {
        authToken = res.body.user.token;
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
          expect(res.body.errors).to.equal('No token provided');
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
          expect(res.body.errors).to.equal('Failed to authenticate token');
          done();
        });
    });
  });
});
