import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import sinon from 'sinon';
import chaiAsPromised from 'chai-as-promised';
import app from '../src/index';
import helpers from '../src/helpers';
import services from '../src/services';
import models from '../src/database/models';

const { Notification } = models;


const { emailNotificationMessage } = helpers;

const token = jwt.sign({ id: '122a0d86-8b78-4bb8-b28f-8e5f7811c456' }, process.env.SECRET_KEY, { expiresIn: '1200s' });
const entityId = '8bd8c0ec-3b50-4228-bb71-e617c7b8d3b5';
const followeeId = '122a0d86-8b78-4bb8-b28f-8e5f7811c456';
const actorId = 'fb94de4d-47ff-4079-89e8-b0186c0a3be8';
const commentId = '6a7b986e-1102-4e9a-83b0-cad7df993e1c';
const novelId = '7f45df6d-7003-424f-86ec-1e2b36e2fd14';


const {
  notificationServices: {
    addNotification, getEntityConfigurationObject, getUserNotification, getNovelData,
    getUsersToBeNotified,
  }
} = services;

chai.use(chaiHttp);
chai.use(chaiAsPromised);

const { expect, should } = chai;
should();

const url = '/api/v1/notifications';

const notificationMessageObject = [{
  actor: 'John Doe',
  message: 'added a new novel',
  novelTitle: 'john wick',
  novelUrl: 'api/vi/novels/1',
}];
const notificationMessageObjectWithNullNovelId = [{
  actor: 'John Doe',
  message: 'added a new novel',
  novelTitle: null,
  novelUrl: null,
}];

describe('NOTIFICATION - A test for notification config object structure', () => {
  it('should have fields table and message on all config object', (done) => {
    expect(getEntityConfigurationObject(0)).to.have.property('entity');
    expect(getEntityConfigurationObject(0)).to.have.property('message');
    done();
  });
  it('should have fields table and message on all config object', (done) => {
    expect(() => getEntityConfigurationObject(200)).to.throw();
    done();
  });
});

describe('Notification helper test', () => {
  it('should have a field html in the returned object', (done) => {
    expect(emailNotificationMessage(notificationMessageObject)).to.have.property('html');
    expect(emailNotificationMessage(notificationMessageObjectWithNullNovelId)).to.have.property('html');
    expect(emailNotificationMessage(notificationMessageObject)).to.have.property('subject');
    done();
  });
});
describe('A test to check if the notification call pass through', () => {
  it('should return true on successful notification of single recipient', async () => {
    const notificationObject = {
      configObjectId: 0, entityId, followeeId, actorId
    };
    const notificationStatus = await addNotification(notificationObject);
    expect(notificationStatus).to.equal(true);
  });
  it('should return true on successful notification of followers', async () => {
    const notificationObject = {
      configObjectId: 0, entityId, followeeId, actorId, isSingle: false
    };
    const notificationStatus = await addNotification(notificationObject);
    expect(notificationStatus).to.equal(true);
  });
});

describe('test for server failure', () => {
  it('should catch server error while trying to get user notification from endpoint', (done) => {
    const stub = sinon.stub(Notification, 'findAll');
    stub.throws(new Error('error occured!'));

    chai.request(app)
      .get(url)
      .set('Authorization', token)
      .end((err, res) => {
        expect(res).status(500);
        stub.restore();
        done();
      });
  });
});

describe('A test to get all notification', () => {
  it('should return an array of objects', async () => {
    const notifications = await getUserNotification(followeeId);
    expect(notifications).to.be.a('array');
  });

  it('should get user notification from endpoint', async () => {
    chai.request(app)
      .get(url)
      .set('Authorization', token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('notifications');
      });
  });
});

describe('A test to get all users to be notified', () => {
  it('should return an array of objects of the users to be notified that follow a user', async () => {
    const users = await getUsersToBeNotified(getEntityConfigurationObject(0), followeeId);
    expect(users).to.be.a('array');
  });
  it('should return an array of objects of the users to be notified that follow a novel', async () => {
    const users = await getUsersToBeNotified(getEntityConfigurationObject(1), novelId);
    expect(users).to.be.a('array');
  });
  it('should return an empty array of users because users don\'t exist', async () => {
    const users = await getUsersToBeNotified(getEntityConfigurationObject(0), '3fd8e8ff-38cc-4cc5-b67a-0c40dee8f6fb');
    expect(users.length).to.equal(0);
  });
  it('should throw an error when table is not specified', async () => {
    expect(getUsersToBeNotified(getEntityConfigurationObject(4), '3fd8e8ff-38cc-4cc5-b67a-0c40dee8f6fb')).to.be.rejectedWith(Error);
  });
});


describe('A test to get novel data', () => {
  it('should return property url and novelData', async () => {
    const config = getEntityConfigurationObject(2);
    const { entity } = config;
    const { novelData, url: novelUrl } = await getNovelData(commentId, entity);
    expect(novelUrl).to.be.a('string');
    expect(novelData).to.have.property('id');
  });
  it('should throw an error when no entity is selected', (done) => {
    expect(getNovelData(commentId, null)).to.be.rejectedWith(Error);
    done();
  });
  it('should throw an error when the entity is not found', (done) => {
    const config = getEntityConfigurationObject(2);
    const { entity } = config;
    expect(getNovelData('122a0d86-8b78-4bb8-b28f-8e5f7811c456', entity)).to.be.rejectedWith(Error);
    done();
  });
});

describe('A test to get novel data', () => {
  it('should return property url and novelData', async () => {
    const config = getEntityConfigurationObject(0);
    const { entity } = config;
    const { novelData, url: novelUrl } = await getNovelData(entityId, entity);
    expect(novelUrl).to.be.a('string');
    expect(novelData).to.have.property('id');
  });
});
