import chai from 'chai';
import jwt from 'jsonwebtoken';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import server from '../src';
import mockData from './mockData';
import models from '../src/database/models';
import helpers from '../src/helpers';

chai.use(chaiHttp);

const { SECRET_KEY } = process.env;

const { expect } = chai;
const { Novel } = models;
const { Genre } = models;
const {
  userMock: { validProfileLogin, validReaderProfileLogin },
  novelMock: {
    validNovel, validNovel2, validGenre, invalidGenre, emptyGenre, existingGenre
  }
} = mockData;
const { novelHelpers: { extractNovels } } = helpers;

const API_VERSION = '/api/v1';
const LOGIN_URL = `${API_VERSION}/users/login`;
const NOVEL_URL = `${API_VERSION}/novels`;
const GENRE_URL = `${API_VERSION}/genres`;
const nonexistNovelEndpoint = `${NOVEL_URL}/3c3b6226-b691-472e-babf-a96c6eb373f0/like`;
const invalidToken = 'ksjbvksvkerlgvdsbv.ergrpewgjperger.gergnkerl';
const nonExistUserToken = jwt.sign({ id: '8b031dd76-7348-425c-98ea-7b4bd5812c6f' }, process.env.SECRET_KEY);
const validSlug = 'hancock';
const invalidSlug = 'this-is-the-first-9a5f3850-c53b-4450-8ce4-d560aa2ca736';
let authToken, authReaderToken;
let endpoint;

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
          endpoint = `/api/v1/novels/${slug}/like`;
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
          expect(response.body.error).to.equal('novel not found');
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
        .post(endpoint)
        .end((err, res) => {
          expect(res).status(401);
          expect(res.body).property('error').eq('you have to be signed in to continue');
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
