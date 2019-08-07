import chai from 'chai';
import jwt from 'jsonwebtoken';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import server from '../src/index';
import mockData from './mockData';
import models from '../src/database/models';
import helpers from '../src/helpers';

chai.use(chaiHttp);

const { SECRET_KEY } = process.env;

const { expect } = chai;
const { Novel } = models;
const { extractNovels } = helpers;
const { userMock, novelMock } = mockData;

let authToken, authReaderToken;

const endpointUser = '/api/v1/users/login';
const endpointNovel = '/api/v1/novels';
const nonexistNovelEndpoint = '/api/v1/novels/3c3b6226-b691-472e-babf-a96c6eb373f0/like';
const invalidToken = 'ksjbvksvkerlgvdsbv.ergrpewgjperger.gergnkerl';
const nonExistUserToken = jwt.sign({ id: '8b031dd76-7348-425c-98ea-7b4bd5812c6f' }, process.env.SECRET_KEY);
let endpoint;

// token of logged in user Eden Hazard in the database
const loggedInUserToken = jwt.sign({ id: '122a0d86-8b78-4bb8-b28f-8e5f7811c456' }, SECRET_KEY, { expiresIn: '120s' });

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

  describe('Pagination support for novels listing', () => {
    it('should return an error response if the page provided is not an integer', (done) => {
      chai.request(server)
        .get(endpointNovel)
        .query({ page: 'abc', limit: 20 })
        .set('authorization', loggedInUserToken)
        .end((error, response) => {
          expect(response.status).to.equal(400);
          expect(response.body).to.haveOwnProperty('errors');
          expect(response.body.errors).to.be.an('array');
          expect(response.body.errors[0]).to.be.an('object');
          expect(response.body.errors[0]).to.have.keys(['field', 'message']);
          expect(response.body.errors[0].field).to.equal('page');
          expect(response.body.errors[0].message).to.equal('page must be an integer');
          done();
        });
    });

    it('should return an error response if the limit provided is not an integer', (done) => {
      chai.request(server)
        .get(endpointNovel)
        .query({ page: 1, limit: 'abc' })
        .set('authorization', loggedInUserToken)
        .end((error, response) => {
          expect(response).to.have.status(400);
          expect(response.body).to.haveOwnProperty('errors');
          expect(response.body.errors).to.be.an('array');
          expect(response.body.errors[0]).to.be.an('object');
          expect(response.body.errors[0]).to.have.keys(['field', 'message']);
          expect(response.body.errors[0].field).to.equal('limit');
          expect(response.body.errors[0].message).to.equal('limit must be an integer');
          done();
        });
    });

    it('should return an error response if the limit query provided is empty', (done) => {
      chai.request(server)
        .get(endpointNovel)
        .query({ page: 1, limit: '' })
        .set('authorization', loggedInUserToken)
        .end((error, response) => {
          expect(response).to.have.status(400);
          expect(response.body).to.haveOwnProperty('errors');
          expect(response.body.errors).to.be.an('array');
          expect(response.body.errors[0]).to.be.an('object');
          expect(response.body.errors[0]).to.have.keys(['field', 'message']);
          expect(response.body.errors[0].field).to.equal('limit');
          expect(response.body.errors[0].message).to.equal('limit cannot be empty');
          done();
        });
    });

    it('should return an error response if the page query provided is empty', (done) => {
      chai.request(server)
        .get(endpointNovel)
        .query({ page: '', limit: 10 })
        .set('authorization', loggedInUserToken)
        .end((error, response) => {
          expect(response).to.have.status(400);
          expect(response.body).to.haveOwnProperty('errors');
          expect(response.body.errors).to.be.an('array');
          expect(response.body.errors[0]).to.be.an('object');
          expect(response.body.errors[0]).to.have.keys(['field', 'message']);
          expect(response.body.errors[0].field).to.equal('page');
          expect(response.body.errors[0].message).to.equal('page cannot be empty');
          done();
        });
    });

    it('should return an appropiate message if the count of novels gotten from the database is less than 1', (done) => {
      const stub = sinon.stub(Novel, 'findAndCountAll');
      stub.returns({ count: 0 });

      chai.request(server)
        .get(endpointNovel)
        .query({ page: 1, limit: 10 })
        .set('authorization', loggedInUserToken)
        .end((error, response) => {
          expect(response).to.have.status(404);
          expect(response.body).to.have.keys(['message', 'data']);
          expect(response.body.message).to.be.a('string');
          expect(response.body.data).to.be.an('array');
          expect(response.body.message).to.equal('no novels found in database');
          stub.restore();
          done();
        });
    });

    it('should return an error message if the page number supplied is more than the available pages', (done) => {
      chai.request(server)
        .get(endpointNovel)
        .query({ page: 1000, limit: 10 })
        .set('authorization', loggedInUserToken)
        .end((error, response) => {
          expect(response).to.have.status(404);
          expect(response.body).to.haveOwnProperty('error');
          expect(response.body.error).to.be.a('string');
          expect(response.body.error).to.equal('page not found');
          done();
        });
    });

    it('should return an error message if a server error occurs', (done) => {
      const stub = sinon.stub(Novel, 'findAndCountAll');
      stub.throws(new Error('error occured!'));

      chai.request(server)
        .get(endpointNovel)
        .query({ limit: 10 })
        .set('authorization', loggedInUserToken)
        .end((error, response) => {
          expect(response).to.have.status(500);
          expect(response.body).to.haveOwnProperty('error');
          expect(response.body.error).to.be.a('string');
          expect(response.body.error).to.equal('error occured!');
          stub.restore();
          done();
        });
    });

    it('should successfully return the novels for that page', (done) => {
      chai.request(server)
        .get(endpointNovel)
        .query({ page: 1, limit: 10 })
        .set('authorization', loggedInUserToken)
        .end((error, response) => {
          expect(response).to.have.status(200);
          expect(response.body).to.have.keys(['message', 'currentPage', 'totalPages', 'limit', 'data']);
          expect(response.body.message).to.be.a('string');
          expect(response.body.data).to.be.an('array');
          expect(response.body.message).to.equal('succesfully returned novels');
          expect(response.body.data.length).to.not.equal(0);
          done();
        });
    });
  });

  describe('Unit test for extractNovels function', () => {
    it('should throw an error if an invalid argument is passed', () => {
      expect(extractNovels.bind(extractNovels, 1)).to.throw('invalid argument type');
    });

    it('should return an empty array if an empty array is passed', () => {
      const results = extractNovels([]);

      expect(results).to.be.an('array');
      expect(results.length).to.equal(0);
    });
  });
});
