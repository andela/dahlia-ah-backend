import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import app from '../src';
import models from '../src/database/models';

const { User } = models;

chai.use(chaiHttp);
const { expect } = chai;
const invalidToken = 'jbkebvisgijlvesbv.genjweglnkjbe';
let url;
let fakeIdUrl;
let invalidIdUrl;
let invalidTokenUrl;
let expiredTokenUrl;
let tokenData;
let userId;

describe('Test for base api base url', () => {
  before(async () => {
    const { id } = await User.create({
      firstName: 'kiddy',
      lastName: 'kuddy',
      username: 'maro',
      email: process.env.ADMIN_MAIL,
      password: 'ohwill949',
    });
    userId = id;

    tokenData = jwt.sign({ id }, process.env.ACCOUNT_VERIFICATION_SECRET);
    const fakeIdTokenData = jwt.sign({ id: '3ac4005a-4942-4a59-a053-5099518e8a7f' }, process.env.ACCOUNT_VERIFICATION_SECRET);
    const invalidIdTokenData = jwt.sign({ id: 1 }, process.env.ACCOUNT_VERIFICATION_SECRET);
    const expTokenData = jwt.sign({ id }, process.env.ACCOUNT_VERIFICATION_SECRET, { expiresIn: '0.2s' });
    url = `/api/v1/auth/verify/${tokenData}`;
    fakeIdUrl = `/api/v1/auth/verify/${fakeIdTokenData}`;
    invalidTokenUrl = `/api/v1/auth/verify/${invalidToken}`;
    expiredTokenUrl = `/api/v1/auth/verify/${expTokenData}`;
    invalidIdUrl = `/api/v1/auth/verify/${invalidIdTokenData}`;
  });

  it('should return a sucess message on sucessful change of verified status', (done) => {
    User.update({
      verifiedToken: tokenData
    }, {
      where: {
        id: userId,
      }
    });
    chai.request(app)
      .patch(url)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('You have sucessfully verified your email');
        done();
      });
  });

  it('should return an error message for invalid token', (done) => {
    User.update({
      verifiedToken: invalidToken
    }, {
      where: {
        id: userId,
      }
    });
    chai.request(app)
      .patch(`${invalidTokenUrl}`)
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.error).to.equal('invalid token');
        done();
      });
  });

  it('should return an error if token does not exist in the database', (done) => {
    chai.request(app)
      .patch(url)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.errors).to.equal('Sorry could not verify email');
        done();
      });
  });

  it('should return an error message if user has been verified', async () => {
    await User.update({
      verifiedToken: tokenData
    }, {
      where: {
        id: userId,
      }
    });
    chai.request(app)
      .patch(`${url}`)
      .end((err, res) => {
        expect(res.body.errors).to.equal('user already verified');
      });
  });

  it('should return an error message if user does not exist', (done) => {
    chai.request(app)
      .patch(`${fakeIdUrl}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.error).to.equal('user not found');
        done();
      });
  });

  it('should return an error message if user id encoded in token is not uuid', (done) => {
    chai.request(app)
      .patch(`${invalidIdUrl}`)
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });

  it('should return an error message if token has expired', (done) => {
    chai.request(app)
      .patch(`${expiredTokenUrl}`)
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.error).to.equal('token expired');
        done();
      });
  });
});
