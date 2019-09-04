import chai from 'chai';
import jwt from 'jsonwebtoken';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import server from '../src';
import mockData from './mockData';
import models from '../src/database/models';
import helpers from '../src/helpers';
import novelServices from '../src/services/novelService';

chai.use(chaiHttp);

const { SECRET_KEY } = process.env;

const { expect } = chai;
const { Novel, Bookmark, readStats } = models;
const { Genre } = models;
const {
  userMock: { validProfileLogin, validReaderProfileLogin, seededUser5 },
  novelMock: {
    validNovel, validNovel2, validGenre, invalidGenre, emptyGenre, existingGenre, seedNovel1
  }
} = mockData;
const { novelHelpers: { extractNovels } } = helpers;

let authToken, authReaderToken, author2token, endpointLike, endpointSlug;

const { bookmarkNovel } = novelServices;

const API_VERSION = '/api/v1';
const LOGIN_URL = `${API_VERSION}/auth/login`;
const NOVEL_URL = `${API_VERSION}/novels`;
const GENRE_URL = `${API_VERSION}/genres`;
const nonexistNovelEndpoint = `${NOVEL_URL}/3c3b6226-b691-472e-babf-a96c6eb373f0/like`;
const invalidToken = 'ksjbvksvkerlgvdsbv.ergrpewgjperger.gergnkerl';
const nonExistUserToken = jwt.sign({ id: '8b031dd76-7348-425c-98ea-7b4bd5812c6f' }, process.env.SECRET_KEY);
const validSlug = 'hancock';
const invalidSlug = 'this-is-the-first-9a5f3850-c53b-4450-8ce4-d560aa2ca736';

const endpointBookmark = '/api/v1/novels/7f45df6d-7003-424f-86ec-1e2b36e2fd14/bookmarks';
const wrongBookmarkId = '/api/v1/novels/35bbffbe-97d4-47f9-88ce-b4502e0489f1/bookmarks';
const endpointFetchBookmark = '/api/v1/novels/bookmarks';
const userIdbookmark = '0ce36391-2c08-4703-bddb-a4ea8cccbbc5';
const novelIdbookmark = '7f45df6d-7003-424f-86ec-1e2b36e2fd14';

// token of logged in user Eden Hazard in the database
const loggedInUserToken = jwt.sign({ id: '122a0d86-8b78-4bb8-b28f-8e5f7811c456' }, SECRET_KEY, { expiresIn: '120s' });

describe('Test for novel CRUD', () => {
  before((done) => {
    chai.request(server)
      .post(LOGIN_URL)
      .send(validProfileLogin)
      .end((error, response) => {
        const { token } = response.body.user;
        authToken = token;
        done();
      });
  });

  before((done) => {
    chai.request(server)
      .post(LOGIN_URL)
      .send(seededUser5)
      .end((err, res) => {
        author2token = res.body.user.token;
        done();
      });
  });

  before((done) => {
    chai.request(server)
      .post(LOGIN_URL)
      .send(validReaderProfileLogin)
      .end((err, res) => {
        authReaderToken = res.body.user.token;
        done();
      });
  });
  describe('POST /api/v1/novels', () => {
    it('should create novel if all fields are valid', (done) => {
      chai.request(server)
        .post(NOVEL_URL)
        .send(validNovel)
        .set('authorization', authToken)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('novel');
          done();
        });
    });

    it('should create another novel if all fields are valid', (done) => {
      chai.request(server)
        .post(NOVEL_URL)
        .send(validNovel2)
        .set('authorization', authToken)
        .end((err, res) => {
          const { novel: { slug } } = res.body;
          endpointSlug = `/api/v1/novels/${slug}`;
          endpointLike = `/api/v1/novels/${slug}/like`;
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('novel');
          done();
        });
    });

    it('should not create novel if user does not have required permission', (done) => {
      chai.request(server)
        .post(NOVEL_URL)
        .send(validNovel)
        .set('authorization', authReaderToken)
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body.error).to.have.equal('you need permission');
          done();
        });
    });

    it('should not create novel if user has a novel with the same title', (done) => {
      chai.request(server)
        .post(NOVEL_URL)
        .send(validNovel)
        .set('authorization', authToken)
        .end((err, res) => {
          expect(res).to.have.status(409);
          expect(res.body.errors).to.have.equal('You already have a novel with this title');
          done();
        });
    });

    it('should not create novel if user is not logged in', (done) => {
      chai.request(server)
        .post(NOVEL_URL)
        .send(validNovel)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.error).to.equal('you have to be signed in to continue');
          done();
        });
    });

    it('should not create novel if user token is wrong', (done) => {
      chai.request(server)
        .post(NOVEL_URL)
        .send(validNovel)
        .set('authorization', 'wrong token')
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.error).to.equal('invalid token');
          done();
        });
    });
  });

  describe('GETs /api/v1/novels/:slug', () => {
    it('should be able to view a novel details', (done) => {
      chai.request(server)
        .get(`${NOVEL_URL}/${validSlug}`)
        .set('authorization', authToken)
        .end((error, response) => {
          expect(response).to.have.status(200);
          expect(response.body).to.be.an('object');
          expect(response.body).to.have.property('novel');
          done();
        });
    });

    it('should not be able to view a novel details if the novel does exist in the database', (done) => {
      chai.request(server)
        .get(`${NOVEL_URL}/${invalidSlug}`)
        .set('authorization', authToken)
        .end((error, response) => {
          expect(response).to.have.status(404);
          expect(response.body).to.be.an('object');
          expect(response.body.error).to.equal('Novel not found');
          done();
        });
    });

    it('should not be able to view a novel details if the token is missing', (done) => {
      chai.request(server)
        .get(`${NOVEL_URL}/${validSlug}`)
        .set('authorization', '')
        .end((error, response) => {
          expect(response).to.have.status(401);
          expect(response.body).to.be.an('object');
          done();
        });
    });

    it('should not be able to view a novel details if the token is invalid', (done) => {
      chai.request(server)
        .get(`${NOVEL_URL}/${validSlug}`)
        .set('authorization', '29327y37grug9')
        .end((error, response) => {
          expect(response).to.have.status(401);
          expect(response.body).to.be.an('object');
          done();
        });
    });

    it('should return an error message if a server error occurs', (done) => {
      const stub = sinon.stub(Novel, 'findOne');
      stub.throws(new Error('error occurred!'));

      chai.request(server)
        .get(`${NOVEL_URL}/${validSlug}`)
        .set('authorization', authToken)
        .end((error, response) => {
          expect(response).to.have.status(500);
          expect(response.body).to.haveOwnProperty('error');
          expect(response.body.error).to.be.a('string');
          expect(response.body.error).to.equal('error occurred!');
          stub.restore();
          done();
        });
    });
  });

  describe('like and dislike functionalities', () => {
    it('should not be able to like or dislike without token', (done) => {
      chai.request(server)
        .post(endpointLike)
        .end((err, res) => {
          expect(res).status(401);
          expect(res.body).property('error').eq('you have to be signed in to continue');
          done();
        });
    });

    it('should not be able to like or dislike without token if token is invalid', (done) => {
      chai.request(server)
        .post(endpointLike)
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
        .post(endpointLike)
        .set('authorization', nonExistUserToken)
        .end((err, res) => {
          expect(res).status(500);
          expect(res.body).property('error');
          done();
        });
    });

    it('should return success message on successful like', (done) => {
      chai.request(server)
        .post(endpointLike)
        .set('authorization', authToken)
        .end((err, res) => {
          expect(res).status(201);
          expect(res.body).property('message').eq('you\'ve succesfully liked this book');
          done();
        });
    });

    it('should return success message on successful unlike', (done) => {
      chai.request(server)
        .post(endpointLike)
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
        .get(NOVEL_URL)
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
        .get(NOVEL_URL)
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
        .get(NOVEL_URL)
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
        .get(NOVEL_URL)
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
        .get(NOVEL_URL)
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
        .get(NOVEL_URL)
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
        .get(NOVEL_URL)
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
        .get(NOVEL_URL)
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

  describe('GET random novels', () => {
    it('should return an error response if the limit provided is not an integer', (done) => {
      chai.request(server)
        .get(`${NOVEL_URL}/random`)
        .query({ limit: 'abc' })
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
        .get(`${NOVEL_URL}/random`)
        .query({ limit: '' })
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

    it('should return an appropiate message if the count of novels gotten from the database is less than 1', (done) => {
      const stub = sinon.stub(Novel, 'findAll');
      stub.returns(false);

      chai.request(server)
        .get(`${NOVEL_URL}/random`)
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

    it('should return an error message if a server error occurs', (done) => {
      const stub = sinon.stub(Novel, 'findAll');
      stub.throws(new Error('error occurred!'));

      chai.request(server)
        .get(`${NOVEL_URL}/random`)
        .end((error, response) => {
          expect(response).to.have.status(500);
          expect(response.body).to.haveOwnProperty('error');
          expect(response.body.error).to.be.a('string');
          expect(response.body.error).to.equal('error occurred!');
          stub.restore();
          done();
        });
    });

    it('should successfully return a random novel', (done) => {
      chai.request(server)
        .get(`${NOVEL_URL}/random`)
        .end((error, response) => {
          expect(response).to.have.status(200);
          expect(response.body).to.have.keys(['message', 'data']);
          expect(response.body.message).to.be.a('string');
          expect(response.body.data).to.be.an('array');
          expect(response.body.message).to.equal('successfully returned novels');
          expect(response.body.data.length).to.not.equal(0);
          done();
        });
    });

    it('should successfully return two random novels', (done) => {
      chai.request(server)
        .get(`${NOVEL_URL}/random`)
        .query({ limit: 2 })
        .end((error, response) => {
          expect(response).to.have.status(200);
          expect(response.body).to.have.keys(['message', 'data']);
          expect(response.body.message).to.be.a('string');
          expect(response.body.data).to.be.an('array');
          expect(response.body.message).to.equal('successfully returned novels');
          expect(response.body.data.length).to.not.equal(0);
          done();
        });
    });
  });

  describe('GET novel of the week', () => {
    it('should return an appropiate message if the count of novels gotten from the database is less than 1', (done) => {
      const stub = sinon.stub(Novel, 'findAll');
      stub.returns(false);

      chai.request(server)
        .get(`${API_VERSION}/noveloftheweek`)
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

    it('should return an error message if a server error occurs', (done) => {
      const stub = sinon.stub(Novel, 'findAll');
      stub.throws(new Error('error occurred!'));

      chai.request(server)
        .get(`${API_VERSION}/noveloftheweek`)
        .end((error, response) => {
          expect(response).to.have.status(500);
          expect(response.body).to.haveOwnProperty('error');
          expect(response.body.error).to.be.a('string');
          expect(response.body.error).to.equal('error occurred!');
          stub.restore();
          done();
        });
    });

    it('should successfully return the novel of the week', (done) => {
      chai.request(server)
        .get(`${API_VERSION}/noveloftheweek`)
        .end((error, response) => {
          expect(response).to.have.status(200);
          expect(response.body).to.have.keys(['message', 'data']);
          expect(response.body.message).to.be.a('string');
          expect(response.body.data).to.be.an('object');
          expect(response.body.message).to.equal('successfully returned novels');
          expect(response.body.data.length).to.not.equal(0);
          done();
        });
    });
  });

  describe('PATCH api/v1/novels/:novelId/markread', () => {
    const markReadEndpoint = `${NOVEL_URL}/${seedNovel1.slug}/markread`;
    const markReadInvalidEndpoint = `${NOVEL_URL}/INVALID_SLUG/markread`;
    it('should mark novel status as read', (done) => {
      chai.request(server)
        .patch(markReadEndpoint)
        .send({ readStatus: true })
        .set('authorization', authToken)
        .end((err, res) => {
          expect(res).status(200);
          expect(res.body).property('message').includes('marked as read');
          done();
        });
    });
    it('should return error 500 on server error', (done) => {
      const stub = sinon.stub(Novel, 'findOne');
      stub.throws(new Error('error occurred!'));

      chai.request(server)
        .patch(markReadEndpoint)
        .send({ readStatus: true })
        .set('authorization', authToken)
        .end((err, res) => {
          expect(res).status(500);
          expect(res.body).property('error').includes('an error occurred');
          stub.restore();
          done();
        });
    });
    it('should remove novel status as read', (done) => {
      chai.request(server)
        .patch(markReadEndpoint)
        .send({ readStatus: false })
        .set('authorization', authToken)
        .end((err, res) => {
          expect(res).status(200);
          expect(res.body).property('message').includes('removed as read');
          done();
        });
    });
    it('should perform no action if removed again', (done) => {
      chai.request(server)
        .patch(markReadEndpoint)
        .send({ readStatus: false })
        .set('authorization', authToken)
        .end((err, res) => {
          expect(res).status(200);
          expect(res.body).property('message').includes('removed as read');
          done();
        });
    });
    it('should perform no action if mark-read again', (done) => {
      chai.request(server)
        .patch(markReadEndpoint)
        .send({ readStatus: true })
        .set('authorization', authToken)
        .end((err, res) => {
          expect(res).status(200);
          expect(res.body).property('message').includes('marked as read');
          done();
        });
    });
    it('should return 404 if slug is invalid', (done) => {
      chai.request(server)
        .patch(markReadInvalidEndpoint)
        .send({ readStatus: true })
        .set('authorization', authToken)
        .end((err, res) => {
          expect(res).status(404);
          expect(res.body).property('error').includes('not found');
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

  describe('Search functionality', () => {
    it('should return an error response if the title supplied is empty', (done) => {
      chai.request(server)
        .get(NOVEL_URL)
        .query({ title: '' })
        .set('authorization', loggedInUserToken)
        .end((error, response) => {
          expect(response.status).to.equal(400);
          expect(response.body).to.haveOwnProperty('errors');
          expect(response.body.errors).to.be.an('array');
          expect(response.body.errors[0]).to.be.an('object');
          expect(response.body.errors[0]).to.have.keys(['field', 'message']);
          expect(response.body.errors[0].field).to.equal('title');
          expect(response.body.errors[0].message).to.equal('title cannot be empty');
          done();
        });
    });

    it('should return an error response if the genre supplied is empty', (done) => {
      chai.request(server)
        .get(NOVEL_URL)
        .query({ genre: '' })
        .set('authorization', loggedInUserToken)
        .end((error, response) => {
          expect(response.status).to.equal(400);
          expect(response.body).to.haveOwnProperty('errors');
          expect(response.body.errors).to.be.an('array');
          expect(response.body.errors[0]).to.be.an('object');
          expect(response.body.errors[0]).to.have.keys(['field', 'message']);
          expect(response.body.errors[0].field).to.equal('genre');
          expect(response.body.errors[0].message).to.equal('genre cannot be empty');
          done();
        });
    });

    it('should return an error response if the author supplied is empty', (done) => {
      chai.request(server)
        .get(NOVEL_URL)
        .query({ author: '' })
        .set('authorization', loggedInUserToken)
        .end((error, response) => {
          expect(response.status).to.equal(400);
          expect(response.body).to.haveOwnProperty('errors');
          expect(response.body.errors).to.be.an('array');
          expect(response.body.errors[0]).to.be.an('object');
          expect(response.body.errors[0]).to.have.keys(['field', 'message']);
          expect(response.body.errors[0].field).to.equal('author');
          expect(response.body.errors[0].message).to.equal('author cannot be empty');
          done();
        });
    });

    it('should return an error response if the keyword supplied is empty', (done) => {
      chai.request(server)
        .get(NOVEL_URL)
        .query({ keyword: '' })
        .set('authorization', loggedInUserToken)
        .end((error, response) => {
          expect(response.status).to.equal(400);
          expect(response.body).to.haveOwnProperty('errors');
          expect(response.body.errors).to.be.an('array');
          expect(response.body.errors[0]).to.be.an('object');
          expect(response.body.errors[0]).to.have.keys(['field', 'message']);
          expect(response.body.errors[0].field).to.equal('keyword');
          expect(response.body.errors[0].message).to.equal('keyword cannot be empty');
          done();
        });
    });

    it('should return an error response if the keyword is supplied with any other generic param', (done) => {
      chai.request(server)
        .get(NOVEL_URL)
        .query({ keyword: 'john', author: 'doe' })
        .set('authorization', loggedInUserToken)
        .end((error, response) => {
          expect(response.status).to.equal(400);
          expect(response.body).to.haveOwnProperty('error');
          expect(response.body.error).to.be.a('string');
          expect(response.body.error).to.equal('keyword cannot be used with title, author or genre');
          done();
        });
    });

    it('should successfully return the novels based on single parameter supplied', (done) => {
      chai.request(server)
        .get(NOVEL_URL)
        .query({ author: 'eden' })
        .set('authorization', loggedInUserToken)
        .end((error, response) => {
          expect(response).to.have.status(200);
          expect(response.body).to.have.keys(['currentPage', 'limit', 'totalPages', 'message', 'data']);
          expect(response.body.message).to.be.a('string');
          expect(response.body.data).to.be.an('array');
          expect(response.body.message).to.equal('succesfully returned novels');
          expect(response.body.data.length).to.not.equal(0);
          done();
        });
    });

    it('should successfully return the novels based on multiple parameter supplied', (done) => {
      chai.request(server)
        .get(NOVEL_URL)
        .query({ author: 'eden', title: 'game' })
        .set('authorization', loggedInUserToken)
        .end((error, response) => {
          expect(response).to.have.status(200);
          expect(response.body).to.have.keys(['currentPage', 'limit', 'totalPages', 'message', 'data']);
          expect(response.body.message).to.be.a('string');
          expect(response.body.data).to.be.an('array');
          expect(response.body.message).to.equal('succesfully returned novels');
          expect(response.body.data.length).to.not.equal(0);
          done();
        });
    });
  });

  describe('Create a genre', () => {
    it('should be able to create a genre', (done) => {
      chai.request(server)
        .post(`${GENRE_URL}`)
        .set('authorization', authToken)
        .send(validGenre)
        .end((error, response) => {
          expect(response).to.have.status(201);
          expect(response.body).to.be.an('object');
          expect(response.body.message).to.equal('genre successfully created');
          done();
        });
    });

    it('should not be able to create a genre if the genre already exist', (done) => {
      chai.request(server)
        .post(`${GENRE_URL}`)
        .set('authorization', authToken)
        .send(existingGenre)
        .end((error, response) => {
          expect(response).to.have.status(200);
          expect(response.body).to.be.an('object');
          done();
        });
    });

    it('should not be able to create a genre if the authorization token is invalid', (done) => {
      chai.request(server)
        .post(`${GENRE_URL}`)
        .set('authorization', 'mklknjknljknklj')
        .send(validGenre)
        .end((error, response) => {
          expect(response).to.have.status(401);
          expect(response.body).to.be.an('object');
          done();
        });
    });

    it('should return an error message if a server error occurs', (done) => {
      const stub = sinon.stub(Genre, 'findOne');
      stub.throws(new Error('error occurred!'));
      chai.request(server)
        .post(`${GENRE_URL}`)
        .set('authorization', authToken)
        .send(validGenre)
        .end((error, response) => {
          expect(response).to.have.status(500);
          expect(response.body).to.haveOwnProperty('error');
          expect(response.body.error).to.be.a('string');
          expect(response.body.error).to.equal('error occurred!');
          stub.restore();
          done();
        });
    });

    it('should not be able to create a genre if request body is empty', (done) => {
      chai.request(server)
        .post(`${GENRE_URL}`)
        .set('authorization', authToken)
        .send({})
        .end((error, response) => {
          expect(response).to.have.status(400);
          expect(response.body).to.be.an('object');
          done();
        });
    });

    it('should not be able to create a genre if genre contains an empty string', (done) => {
      chai.request(server)
        .post(`${GENRE_URL}`)
        .set('authorization', authToken)
        .send(emptyGenre)
        .end((error, response) => {
          expect(response).to.have.status(400);
          expect(response.body).to.be.an('object');
          done();
        });
    });

    it('should not be able to create a genre if genre contains invalid characters', (done) => {
      chai.request(server)
        .post(`${GENRE_URL}`)
        .set('authorization', authToken)
        .send(invalidGenre)
        .end((error, response) => {
          expect(response).to.have.status(400);
          expect(response.body).to.be.an('object');
          done();
        });
    });

    it('should not be able to create a genre if authorization token is empty', (done) => {
      chai.request(server)
        .post(`${GENRE_URL}`)
        .set('authorization', '')
        .send({})
        .end((error, response) => {
          expect(response).to.have.status(401);
          expect(response.body).to.be.an('object');
          done();
        });
    });
  });

  describe('POST /api/v1/novels/:noveId/bookmarks', () => {
    it('should successfully bookmark a novel and return a status code of 201', (done) => {
      chai.request(server)
        .post(endpointBookmark)
        .set('authorization', authToken)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.bookmark).to.have.property('title');
          done();
        });
    });

    it('should successfully fetched all bookmarks', (done) => {
      chai.request(server)
        .get(endpointFetchBookmark)
        .set('authorization', authToken)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.bookmarks).to.be.an('array');
          expect(res.body.message).to.equal('Bookmarks fetched successfully');
          done();
        });
    });

    it('should return error response if novel is not found', (done) => {
      chai.request(server)
        .post(wrongBookmarkId)
        .set('authorization', authToken)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body.error).to.equal('novel not found');
          done();
        });
    });

    it('test for bookmark service', async () => {
      const bookmark = await bookmarkNovel(userIdbookmark, novelIdbookmark);
      expect(bookmark).to.have.property('novelId');
    });

    it('should return a failure response if a server error occurs', (done) => {
      const stub = sinon.stub(Bookmark, 'create');
      stub.throws(new Error('error occurred!'));

      chai.request(server)
        .post(endpointBookmark)
        .set('authorization', authToken)
        .end((error, response) => {
          expect(response).to.have.status(500);
          expect(response.body).to.be.an('object');
          expect(response.body.error).to.equal('error occurred!');
          stub.restore();
          done();
        });
    });
  });

  describe('Get all genre', () => {
    it('should return an appropiate message if the count of genres gotten from the database is less than 1', (done) => {
      chai.request(server)
        .get(`${GENRE_URL}?keyword=z`)
        .set('authorization', loggedInUserToken)
        .end((error, response) => {
          expect(response).to.have.status(200);
          expect(response.body).to.have.keys(['message', 'data']);
          expect(response.body.message).to.be.a('string');
          expect(response.body.data).to.be.an('array');
          expect(response.body.message).to.equal('successfully returned genres');
          done();
        });
    });

    it('should return an error message if a server error occurs', (done) => {
      const stub = sinon.stub(Genre, 'findAll');
      stub.throws(new Error('error occurred!'));

      chai.request(server)
        .get(GENRE_URL)
        .set('authorization', loggedInUserToken)
        .end((error, response) => {
          expect(response).to.have.status(500);
          expect(response.body).to.haveOwnProperty('error');
          expect(response.body.error).to.be.a('string');
          expect(response.body.error).to.equal('error occurred!');
          stub.restore();
          done();
        });
    });

    it('should return a failure response if a server error occurs', (done) => {
      const stub = sinon.stub(Bookmark, 'findAll');
      stub.throws(new Error('error occurred!'));

      chai.request(server)
        .get(endpointFetchBookmark)
        .set('authorization', authToken)
        .end((error, response) => {
          expect(response).to.have.status(500);
          expect(response.body).to.be.an('object');
          expect(response.body.error).to.equal('error occurred!');
          stub.restore();
          done();
        });
    });

    it('should successfully return all genres', (done) => {
      chai.request(server)
        .get(GENRE_URL)
        .set('authorization', loggedInUserToken)
        .end((error, response) => {
          expect(response).to.have.status(200);
          expect(response.body).to.have.keys(['message', 'data']);
          expect(response.body.message).to.be.a('string');
          expect(response.body.data).to.be.an('array');
          expect(response.body.message).to.equal('successfully returned genres');
          expect(response.body.data.length).to.not.equal(0);
          done();
        });
    });
  });
});

describe('PATCH /api/v1/novels/:slug', () => {
  it('should update novel', (done) => {
    chai.request(server)
      .patch(endpointSlug)
      .send({
        description: 'different'
      })
      .set('authorization', authToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('novel');
        done();
      });
  });

  it('should not update novel if novel does not exist', (done) => {
    chai.request(server)
      .patch(`${endpointSlug}2`)
      .send({
        description: 'different'
      })
      .set('authorization', authToken)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('error').eq('Novel not found');
        done();
      });
  });

  it('should not update novel if novel does not belong to user', (done) => {
    chai.request(server)
      .patch(endpointSlug)
      .send({
        description: 'so different'
      })
      .set('authorization', author2token)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body).to.have.property('error').eq('You cannot edit this book');
        done();
      });
  });

  it('should return a failure response if a server error occurs', (done) => {
    const stub = sinon.stub(Novel, 'findOne');
    stub.throws(new Error('error occured!'));

    chai.request(server)
      .patch(endpointSlug)
      .set('authorization', authToken)
      .end((error, response) => {
        expect(response).to.have.status(500);
        expect(response.body).to.be.an('object');
        expect(response.body.error).to.equal('error occured!');
        stub.restore();
        done();
      });
  });
});

describe('DELETE /api/v1/novels/:slug', () => {
  it('should not delete novel if novel does not exist', (done) => {
    chai.request(server)
      .delete(`${endpointSlug}2`)
      .set('authorization', authToken)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('error').eq('Novel not found');
        done();
      });
  });

  it('should not delete novel if novel does not belong to user', (done) => {
    chai.request(server)
      .delete(endpointSlug)
      .set('authorization', author2token)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body).to.have.property('error').eq('You cannot delete this book');
        done();
      });
  });

  it('should delete novel', (done) => {
    chai.request(server)
      .delete(endpointSlug)
      .set('authorization', authToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message').eq('Novel deleted successfully');
        done();
      });
  });

  it('should return a failure response if a server error occurs', (done) => {
    const stub = sinon.stub(Novel, 'findOne');
    stub.throws(new Error('error occured!'));

    chai.request(server)
      .delete(endpointSlug)
      .set('authorization', authToken)
      .end((error, response) => {
        expect(response).to.have.status(500);
        expect(response.body).to.be.an('object');
        expect(response.body.error).to.equal('error occured!');
        stub.restore();
        done();
      });
  });
});
describe('GET api/v1/profiles/readingstats', () => {
  const readStatsEndpoint = '/api/v1/profiles/readingstats';
  const readStatsWithPeriod = `${readStatsEndpoint}?period=10`;
  const readStatsWithInvalidPeriod = `${readStatsEndpoint}?period=INVALID`;
  it('should fetch read stats', (done) => {
    chai.request(server)
      .get(readStatsEndpoint)
      .set('authorization', authToken)
      .end((err, res) => {
        expect(res).status(200);
        expect(res.body).property('message').include('success');
        expect(res.body).property('readingStats').an('object');
        done();
      });
  });
  it('should fetch read stats with period', (done) => {
    chai.request(server)
      .get(readStatsWithPeriod)
      .set('authorization', authToken)
      .end((err, res) => {
        expect(res).status(200);
        expect(res.body).property('message').include('success');
        expect(res.body).property('readingStats').an('object');
        done();
      });
  });
  it('should fetch DEFAULT read stats with invalid period query', (done) => {
    chai.request(server)
      .get(readStatsWithInvalidPeriod)
      .set('authorization', authToken)
      .end((err, res) => {
        expect(res).status(200);
        expect(res.body).property('message').include('success');
        expect(res.body).property('readingStats').an('object');
        done();
      });
  });
  it('should return error 500 on server error', (done) => {
    const stub = sinon.stub(readStats, 'findAndCountAll');
    stub.throws(new Error('error occurred!'));

    chai.request(server)
      .get(readStatsEndpoint)
      .set('authorization', authToken)
      .end((err, res) => {
        expect(res).status(500);
        expect(res.body).property('error').include('an error occurred');
        stub.restore();
        done();
      });
  });
});
