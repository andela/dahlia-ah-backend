import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../src/index';
import mockData from './mockData';
import models from '../src/database/models';

chai.use(chaiHttp);

const { expect } = chai;
const { Highlight } = models;
const {
  userMock: { seededUser1, seededUser3, seededUser4 },
  novelMock: { highlightNovel },
  highlightMock: { validHighlight }
} = mockData;

let authorToken, readerToken, reader2Token, novelSlug;

const endpointUser = '/api/v1/users/login';
const endpointNovel = '/api/v1/novels';

describe('Test for highlights', () => {
  before((done) => {
    chai.request(app)
      .post(endpointUser)
      .send(seededUser1)
      .end((err, res) => {
        readerToken = res.body.user.token;
        done();
      });
  });
  before((done) => {
    chai.request(app)
      .post(endpointUser)
      .send(seededUser4)
      .end((err, res) => {
        reader2Token = res.body.user.token;
        done();
      });
  });
  before((done) => {
    chai.request(app)
      .post(endpointUser)
      .send(seededUser3)
      .end((err, res) => {
        authorToken = res.body.user.token;
        done();
      });
  });
  before((done) => {
    chai.request(app)
      .post(endpointNovel)
      .send(highlightNovel)
      .set('authorization', authorToken)
      .end((err, res) => {
        novelSlug = res.body.novel.slug;
        done();
      });
  });

  describe('Post /api/v1/novels/:slug/highlight', () => {
    it('should create highlight if all fields are valid', (done) => {
      chai.request(app)
        .post(`${endpointNovel}/${novelSlug}/highlight`)
        .send(validHighlight)
        .set('authorization', readerToken)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('highlight');
          done();
        });
    });

    it('should not create highlight if novel is not found', (done) => {
      chai.request(app)
        .post(`${endpointNovel}/nfej3-3m30/highlight`)
        .send(validHighlight)
        .set('authorization', readerToken)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.error).to.equal('Novel not found');
          done();
        });
    });

    it('should return a failure response if a server error occurs', (done) => {
      const stub = sinon.stub(Highlight, 'create');
      stub.throws(new Error('error occured!'));

      chai.request(app)
        .post(`${endpointNovel}/${novelSlug}/highlight`)
        .send(validHighlight)
        .set('authorization', readerToken)
        .end((error, response) => {
          expect(response).to.have.status(500);
          expect(response.body).to.be.an('object');
          expect(response.body.error).to.equal('error occured!');
          stub.restore();
          done();
        });
    });
  });

  describe('GET /api/v1/novels/:slug', () => {
    it('should get novel with all user highlights', (done) => {
      chai.request(app)
        .get(`${endpointNovel}/${novelSlug}`)
        .set('authorization', readerToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('novel');
          expect(res.body).to.have.property('highlights');
          done();
        });
    });

    it('should get novel without highlights if user has no highlights', (done) => {
      chai.request(app)
        .get(`${endpointNovel}/${novelSlug}`)
        .set('authorization', reader2Token)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('novel');
          expect(res.body).to.not.have.property('highlights');
          done();
        });
    });

    it('should get all novel highlights if author', (done) => {
      chai.request(app)
        .get(`${endpointNovel}/${novelSlug}`)
        .set('authorization', authorToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('novel');
          expect(res.body).to.have.property('highlights');
          done();
        });
    });

    it('should not get highlight if novel does not exist', (done) => {
      chai.request(app)
        .get(`${endpointNovel}/nfej3-3m30`)
        .set('authorization', readerToken)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.error).to.equal('Novel not found');
          done();
        });
    });

    it('should return a failure response if a server error occurs', (done) => {
      const stub = sinon.stub(Highlight, 'findAll');
      stub.throws(new Error('error occured!'));

      chai.request(app)
        .get(`${endpointNovel}/${novelSlug}`)
        .set('authorization', readerToken)
        .end((error, response) => {
          expect(response).to.have.status(500);
          expect(response.body).to.be.an('object');
          expect(response.body.error).to.equal('error occured!');
          stub.restore();
          done();
        });
    });
  });
});
