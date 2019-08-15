import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import server from '../src/index';
import mockData from './mockData';
import models from '../src/database/models';

chai.use(chaiHttp);

const { expect } = chai;
const { userMock, reportMock } = mockData;
const { Novel, Report } = models;

let authToken;

const endpointUser = '/api/v1/users/login';
const endpointReport = '/api/v1/novels/hancock/report';
const invalidReportEnpoint = '/api/v1/novels/invalid/report';
const getAllReportUrl = '/api/v1/report';
const getAllHandledReportUrl = '/api/v1/report?isHandled=true';
const markReportAsHandledUrl = '/api/v1/report/67a68419-405a-45e6-8d4f-cb00cbff7a64';
const invalidMarkReportAsHandledUrl = '/api/v1/report/2cec37fd-feeb-4b01-9bfe-14e81d578e18';
const invalidUUID = '/api/v1/report/2cec37fd-feeb-4b01-9bfe-14e81d578k';

describe('testing report route', () => {
  it('should get users token', (done) => {
    const user = userMock.seededUser1;
    chai.request(server)
      .post(endpointUser)
      .send(user)
      .end((err, res) => {
        expect(res.body.user).to.have.property('token');
        authToken = res.body.user.token;
        done();
      });
  });
  it('should return a message of successful report', (done) => {
    chai.request(server)
      .post(endpointReport)
      .send(reportMock.validReport)
      .set('authorization', authToken)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('message');
        done();
      });
  });
  it('should return a message of successful report and check for bad words', (done) => {
    chai.request(server)
      .post(endpointReport)
      .send(reportMock.validReportBadWords)
      .set('authorization', authToken)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('message');
        done();
      });
  });
  it('should return an error on wrong input', (done) => {
    chai.request(server)
      .post(endpointReport)
      .send(reportMock.invalidReport)
      .set('authorization', authToken)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('errors');
        done();
      });
  });
  it('should return an error on wrong input type', (done) => {
    chai.request(server)
      .post(endpointReport)
      .send(reportMock.invalidType)
      .set('authorization', authToken)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('errors');
        done();
      });
  });
});

describe('test for reporting non existing novel', () => {
  it('should return status 404', (done) => {
    chai.request(server)
      .post(invalidReportEnpoint)
      .send(reportMock.validReport)
      .set('authorization', authToken)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('error');
        done();
      });
  });
});
describe('test for getting reports', () => {
  it('should return all report', (done) => {
    chai.request(server)
      .get(getAllReportUrl)
      .set('authorization', authToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('data');
        done();
      });
  });
  it('should return all handled report', (done) => {
    chai.request(server)
      .get(getAllHandledReportUrl)
      .set('authorization', authToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('data');
        done();
      });
  });
});
describe('test for marking report as handled', () => {
  it('should return a success message', (done) => {
    chai.request(server)
      .patch(markReportAsHandledUrl)
      .set('authorization', authToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message');
        done();
      });
  });
  it('should return an error for wrong params', (done) => {
    chai.request(server)
      .patch(invalidMarkReportAsHandledUrl)
      .set('authorization', authToken)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error');
        done();
      });
  });
  it('should return an error for invalid UUID', (done) => {
    chai.request(server)
      .patch(invalidUUID)
      .set('authorization', authToken)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('errors');
        done();
      });
  });
});
describe('test for handling 500 errors', () => {
  it('should return a success message', (done) => {
    const stub = sinon.stub(Novel, 'findOne');
    stub.throws(new Error('error occured!'));

    chai.request(server)
      .post(endpointReport)
      .send(reportMock.validReport)
      .set('authorization', authToken)
      .end((err, res) => {
        expect(res).to.have.status(500);
        stub.restore();
        done();
      });
  });
  it('should return an error 500 when trying to get all report', (done) => {
    const stub = sinon.stub(Report, 'findAll');
    stub.throws(new Error('error occured!'));

    chai.request(server)
      .get(getAllReportUrl)
      .set('authorization', authToken)
      .end((err, res) => {
        expect(res).to.have.status(500);
        stub.restore();
        done();
      });
  });
  it('should return an error 500 when trying to get all report', (done) => {
    const stub = sinon.stub(Report, 'update');
    stub.throws(new Error('error occured!'));

    chai.request(server)
      .patch(markReportAsHandledUrl)
      .set('authorization', authToken)
      .end((err, res) => {
        expect(res).to.have.status(500);
        stub.restore();
        done();
      });
  });
});
