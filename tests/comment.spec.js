import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import server from '../src';
import models from '../src/database/models';
import mockData from './mockData';

dotenv.config();

const { SECRET_KEY } = process.env;

chai.use(chaiHttp);
const { expect } = chai;

const { User, Novel } = models;
const { commentMock } = mockData;
const { validComment, invalidComment } = commentMock;

const BASE_URL = '/api/v1';
const COMMENT_URL = `${BASE_URL}/novels/hancock/comments`;
const REPLY_URL = `${BASE_URL}/novels/hancock/comments/6a7b986e-1102-4e9a-83b0-cad7df993e1c`;

const wrongSlugUrlForComment = `${BASE_URL}/novels/no-slug-like-this-in-database/comments`;
const wrongSlugUrlForReply = `${BASE_URL}/novels/no-slug-like-this-in-database/comments/6a7b986e-1102-4e9a-83b0-cad7df993e1c`;
const wrongParentIdUrl = `${BASE_URL}/novels/hancock/comments/394d6e2b-5217-476f-866e-8fba89527a45`;
const nonParentCommentUrl = `${BASE_URL}/novels/hancock/comments/b84f246f-ba18-4f83-876d-145be90b494d`;
const emptySlugUrl = `${BASE_URL}/novels/ /comments/6a7b986e-1102-4e9a-83b0-cad7df993e1c`;
const whitespaceSlugUrl = `${BASE_URL}/novels/best-book in-the-world/comments/1`;
const invalidParentIdUrl = `${BASE_URL}/novels/religion-versus-spirituality/comments/g`;

// token of subscribed user Eden Hazard in the database
const subscribedUserToken = jwt.sign({ id: '122a0d86-8b78-4bb8-b28f-8e5f7811c456' }, SECRET_KEY, { expiresIn: '60s' });

describe('COMMENT ROUTES', () => {
  // Create A Comment On A Post
  describe('Create A Parent Comment', () => {
    it('should return an error if the user\'s token is expired', (done) => {
      const expiredToken = jwt.sign({ id: 1 }, SECRET_KEY, { expiresIn: '0.01s' });
      chai.request(server)
        .post(emptySlugUrl)
        .send(validComment)
        .set('authorization', expiredToken)
        .end((error, response) => {
          expect(response).to.have.status(401);
          expect(response.body).to.be.an('object');
          expect(response.body.error).to.equal('token expired, you have to be signed in to continue');
          done();
        });
    });

    it('should return an error if the token provided is invalid', (done) => {
      chai.request(server)
        .post(emptySlugUrl)
        .send(validComment)
        .set('authorization', '134invalid34324token')
        .end((error, response) => {
          expect(response).to.have.status(401);
          expect(response.body).to.be.an('object');
          expect(response.body.error).to.equal('you have to be signed in to continue');
          done();
        });
    });

    it('should return an error if no token is provided', (done) => {
      chai.request(server)
        .post(emptySlugUrl)
        .send(validComment)
        .end((error, response) => {
          expect(response).to.have.status(401);
          expect(response.body).to.be.an('object');
          expect(response.body.error).to.equal('you have to be signed in to continue');
          done();
        });
    });

    it('should return an error if the slug in the Url param is empty', (done) => {
      chai.request(server)
        .post(emptySlugUrl)
        .send(validComment)
        .set('authorization', subscribedUserToken)
        .end((error, response) => {
          expect(response).to.have.status(400);
          expect(response.body).to.be.an('object');
          expect(response.body.errors[0].message).to.equal('slug cannot be empty');
          done();
        });
    });

    it('should return an error if the slug in the Url param contains a whitespace', (done) => {
      chai.request(server)
        .post(whitespaceSlugUrl)
        .send(validComment)
        .set('authorization', subscribedUserToken)
        .end((error, response) => {
          expect(response).to.have.status(400);
          expect(response.body).to.be.an('object');
          expect(response.body.errors[0].message).to.equal('slug cannot contain whitespace');
          done();
        });
    });

    it('should return an error if the the commentBody is missing from the request', (done) => {
      chai.request(server)
        .post(COMMENT_URL)
        .send({})
        .set('authorization', subscribedUserToken)
        .end((error, response) => {
          expect(response).to.have.status(400);
          expect(response.body).to.be.an('object');
          expect(response.body.errors[0].message).to.equal('commentBody is a required field');
          done();
        });
    });

    it('should return an error if the the commentBody is missing from the request', (done) => {
      chai.request(server)
        .post(COMMENT_URL)
        .send(invalidComment)
        .set('authorization', subscribedUserToken)
        .end((error, response) => {
          expect(response).to.have.status(400);
          expect(response.body).to.be.an('object');
          expect(response.body.errors[0].message).to.equal('commentBody cannot be empty');
          done();
        });
    });

    it('should return an error if an unfound user tries to access the account', (done) => {
      // token of unfound user
      const notFoundUserToken = jwt.sign({ id: '0e8d9f25-ce70-4037-96cd-1e115bc676ea' }, SECRET_KEY, { expiresIn: '60s' });

      chai.request(server)
        .post(COMMENT_URL)
        .send(validComment)
        .set('authorization', notFoundUserToken)
        .end((error, response) => {
          expect(response).to.have.status(404);
          expect(response.body).to.be.an('object');
          expect(response.body.error).to.equal('user not found');
          done();
        });
    });

    it('should return an error if an unSubscribed user tries to access this endpoint', (done) => {
      // token of unSubscribed user James Bond in the database
      const unSubscribedUserToken = jwt.sign({ id: 'fb94de4d-47ff-4079-89e8-b0186c0a3be8' }, SECRET_KEY, { expiresIn: '60s' });

      chai.request(server)
        .post(COMMENT_URL)
        .send(validComment)
        .set('authorization', unSubscribedUserToken)
        .end((error, response) => {
          expect(response).to.have.status(403);
          expect(response.body).to.be.an('object');
          expect(response.body.error).to.equal('you have to be subscribed to comment on a novel');
          done();
        });
    });

    it('should return an error if there\'s no novel with the provided slug', (done) => {
      chai.request(server)
        .post(wrongSlugUrlForComment)
        .send(validComment)
        .set('authorization', subscribedUserToken)
        .end((error, response) => {
          expect(response).to.have.status(404);
          expect(response.body).to.be.an('object');
          expect(response.body.error).to.equal('novel not found');
          done();
        });
    });

    it('should successfully create a comment', (done) => {
      chai.request(server)
        .post(COMMENT_URL)
        .send(validComment)
        .set('authorization', subscribedUserToken)
        .end((error, response) => {
          expect(response).to.have.status(201);
          expect(response.body).to.be.an('object');
          expect(response.body).to.haveOwnProperty('comment');
          expect(response.body.comment).to.be.an('object');
          expect(response.body.comment).to.have.keys(['novel', 'commenter', 'commentBody', 'updatedAt']);
          done();
        });
    });

    it('should return a failure response if a server error occurs', (done) => {
      const stub = sinon.stub(Novel, 'findOne');
      stub.throws(new Error('error occured!'));

      chai.request(server)
        .post(COMMENT_URL)
        .send(validComment)
        .set('authorization', subscribedUserToken)
        .end((error, response) => {
          expect(response).to.have.status(500);
          expect(response.body).to.be.an('object');
          expect(response.body.error).to.equal('error occured!');
          stub.restore();
          done();
        });
    });

    it('should return a failure response if a server error occurs', (done) => {
      const stub = sinon.stub(User, 'findOne');
      stub.throws(new Error('error occured!'));

      chai.request(server)
        .post(COMMENT_URL)
        .send(validComment)
        .set('authorization', subscribedUserToken)
        .end((error, response) => {
          expect(response).to.have.status(500);
          expect(response.body).to.be.an('object');
          expect(response.body.error).to.equal('error occured!');
          stub.restore();
          done();
        });
    });
  });

  // Create A Reply To A Comment
  describe('Create A Reply To A Comment', () => {
    it('should return an error if the parentId in the Url param isn\'t an integer', (done) => {
      chai.request(server)
        .post(invalidParentIdUrl)
        .send(validComment)
        .set('authorization', subscribedUserToken)
        .end((error, response) => {
          expect(response).to.have.status(400);
          expect(response.body).to.be.an('object');
          expect(response.body.errors[0].message).to.equal('parentId must be an UUID');
          done();
        });
    });

    it('should return an error if an unSubscribed user tries to access this endpoint', (done) => {
      // token of unSubscribed user James Bond in the database
      const unSubscribedUserToken = jwt.sign({ id: 'fb94de4d-47ff-4079-89e8-b0186c0a3be8' }, SECRET_KEY, { expiresIn: '60s' });

      chai.request(server)
        .post(REPLY_URL)
        .send(validComment)
        .set('authorization', unSubscribedUserToken)
        .end((error, response) => {
          expect(response).to.have.status(403);
          expect(response.body).to.be.an('object');
          expect(response.body.error).to.equal('you have to be subscribed to reply a comment');
          done();
        });
    });

    it('should return an error if there\'s no novel with the provided slug', (done) => {
      chai.request(server)
        .post(wrongSlugUrlForReply)
        .send(validComment)
        .set('authorization', subscribedUserToken)
        .end((error, response) => {
          expect(response).to.have.status(404);
          expect(response.body).to.be.an('object');
          expect(response.body.error).to.equal('novel not found');
          done();
        });
    });

    it('should return an error if there\'s no comment with the given parentId', (done) => {
      chai.request(server)
        .post(wrongParentIdUrl)
        .send(validComment)
        .set('authorization', subscribedUserToken)
        .end((error, response) => {
          expect(response).to.have.status(404);
          expect(response.body).to.be.an('object');
          expect(response.body.error).to.equal('no comment found with the provided id');
          done();
        });
    });

    it('should return an error if the user tries to reply to a non-parent comment', (done) => {
      chai.request(server)
        .post(nonParentCommentUrl)
        .send(validComment)
        .set('authorization', subscribedUserToken)
        .end((error, response) => {
          expect(response).to.have.status(403);
          expect(response.body).to.be.an('object');
          expect(response.body.error).to.equal('you can only reply a parent comment');
          done();
        });
    });

    it('should successfully create a reply', (done) => {
      chai.request(server)
        .post(REPLY_URL)
        .send({ commentBody: 'nice one there' })
        .set('authorization', subscribedUserToken)
        .end((error, response) => {
          expect(response).to.have.status(201);
          expect(response.body).to.be.an('object');
          expect(response.body).to.haveOwnProperty('reply');
          expect(response.body.reply).to.be.an('object');
          expect(response.body.reply).to.have.keys(['novel', 'parentComment', 'replier', 'replyBody', 'updatedAt']);
          done();
        });
    });

    it('should return a failure response if a server error occurs', (done) => {
      const stub = sinon.stub(Novel, 'findOne');
      stub.throws(new Error('error occured!'));

      chai.request(server)
        .post(REPLY_URL)
        .send(validComment)
        .set('authorization', subscribedUserToken)
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
