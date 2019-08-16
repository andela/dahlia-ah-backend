import chai from 'chai';
import jwt from 'jsonwebtoken';
import chaiHttp from 'chai-http';
import server from '../src/index';
import mockData from './mockData';

chai.use(chaiHttp);

const { expect } = chai;
const { userMock, novelMock } = mockData;

let authToken, authReaderToken;

const endpointUser = '/api/v1/users/login';
const endpointNovel = '/api/v1/novels';
const nonexistNovelEndpoint = '/api/v1/novels/3c3b6226-b691-472e-babf-a96c6eb373f0/like';
const invalidToken = 'ksjbvksvkerlgvdsbv.ergrpewgjperger.gergnkerl';
const nonExistUserToken = jwt.sign({ id: '8b031dd76-7348-425c-98ea-7b4bd5812c6f' }, process.env.SECRET_KEY);
let endpoint;

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
          const { novel: { slug } } = res.body;
          endpoint = `/api/v1/novels/${slug}/like`;
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

  describe('like and dislike functionalities', () => {
    it('should not be able to like or dislike without token', (done) => {
      chai.request(server)
        .post(endpoint)
        .end((err, res) => {
          expect(res).status(401);
          expect(res.body).property('error').eq('no token provided');
          done();
        });
    });

    it('should not be able to like or dislike without token if token is invalid', (done) => {
      chai.request(server)
        .post(endpoint)
        .set('authorization', invalidToken)
        .end((err, res) => {
          expect(res).status(401);
          expect(res.body).property('error').eq('invalid token');
          done();
        });
    });

    it('should return if novel does not exist', (done) => {
      chai.request(server)
        .post(nonexistNovelEndpoint)
        .set('authorization', authToken)
        .end((err, res) => {
          expect(res).status(404);
          expect(res.body).property('errors').eq('user or novel does not exist');
          done();
        });
    });

    it('should return if user does not exist', (done) => {
      chai.request(server)
        .post(endpoint)
        .set('authorization', nonExistUserToken)
        .end((err, res) => {
          expect(res).status(500);
          expect(res.body).property('error');
          done();
        });
    });

    it('should return success message on successful like', (done) => {
      chai.request(server)
        .post(endpoint)
        .set('authorization', authToken)
        .end((err, res) => {
          expect(res).status(201);
          expect(res.body).property('message').eq('you\'ve succesfully liked this book');
          done();
        });
    });

    it('should return success message on successful unlike', (done) => {
      chai.request(server)
        .post(endpoint)
        .set('authorization', authToken)
        .end((err, res) => {
          expect(res).status(201);
          expect(res.body).property('message').eq('you\'ve succesfully unliked this book');
          done();
        });
    });
  });
});
