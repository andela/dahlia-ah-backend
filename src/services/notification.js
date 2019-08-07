import db from '../database/models';
import sendMail from './sendMail';
import helpers from '../helpers';

const { emailNotificationMessage, notificationConfig, responseMessage } = helpers;

const {
  User, Follower, Like, Novel, NotificationObject, Notification, Comment
} = db;

/**
 * @description get the config object from an array of config
 * @param  {Integer} entityTypeId - the index of the selected config object
 * @returns {Object} - the config object
 */
const getEntityConfigurationObject = (entityTypeId) => {
  const configurationObject = notificationConfig[entityTypeId];
  if (configurationObject === undefined) {
    throw new Error('Invalid notification configuration type selection, did you enter the right config index?');
  }
  return configurationObject;
};

const getNovelData = async (entityId, entity) => {
  const baseUrl = '/api/v1/novels/';
  let novelData;
  let url;
  let commentData;
  switch (entity) {
    case 'novel':
      novelData = await Novel.findByPk(entityId);
      url = `${baseUrl}${novelData.id}`;
      break;
    case 'comment':
      commentData = await Comment.findByPk(entityId);
      novelData = await Novel.findByPk(commentData.novelId);
      url = `${baseUrl}${novelData.id}#${commentData.id}`;
      break;
    default:
      throw new Error('Kindly select an entity in the configuration object');
  }
  return { novelData, url };
};

const buildUserNotificationObject = (notifications) => {
  const notificationPromise = notifications.map(async ({ notificationObjectId, isRead }) => {
    let novelTitle = null, novelUrl = null;
    const {
      entityId, entityTypeId, actorId, createdAt
    } = await NotificationObject.findByPk(notificationObjectId);
    const { message, entity } = getEntityConfigurationObject(entityTypeId);
    if (entityId) {
      const { novelData: { title }, url } = await getNovelData(entityId, entity);
      novelTitle = title;
      novelUrl = url;
    }
    const { firstName, lastName } = await User.findByPk(actorId);

    const data = {
      actor: `${firstName} ${lastName}`, message, novelTitle, novelUrl, createdAt, isRead
    };
    return data;
  });
  return Promise.all(notificationPromise);
};

const getUserNotification = async (id) => {
  const notifications = await Notification.findAll({ where: { notifierId: id, isRead: false } });
  const userNotificationObject = buildUserNotificationObject(notifications);
  return userNotificationObject;
};

const broadcastNotification = async (notificationObjectId) => {
  const notifications = await Notification.findAll({
    where: { notificationObjectId }, include: [{ model: User }]
  });
  notifications.forEach(async (notification) => {
    const { User: UserToBeNotified } = notification;
    const { email, allowEmailNotification, id } = UserToBeNotified;
    const notificationObject = await buildUserNotificationObject([notification]);
    const { io } = global;
    io.emit(`notification-${id}`, notificationObject[0]);
    if (allowEmailNotification) {
      const message = emailNotificationMessage(notificationObject);
      await sendMail(process.env.ADMIN_MAIL, email, message);
    }
  });
};

/**
 * @description creates a notification dynamically by using configuration parameters
 * @param  {Object} notificationObject - configuration object containing the following table
 * @param  {integer} followeeId - the id of the entity being followed
 * @returns {Object} - array of users that need to be notified
 */
const getUsersToBeNotified = async ({ following }, followeeId) => {
  let data = null;

  switch (following) {
    case 'user':
      data = User.findOne({
        where: { id: followeeId }, include: [{ model: Follower, as: 'usersToBeNotified' }]
      });
      break;
    case 'novel':
      data = Novel.findOne({
        where: { id: followeeId }, include: [{ model: Like }]
      });
      break;
    default:
      throw new Error('following property not specified on the config object you selected on notificationConfig.js, are you trying to notify a single author? kindly set the isSingle flag to true');
  }
  const followeeData = await data;
  if (!followeeData) {
    return [];
  }
  const usersToBeNotified = followeeData.usersToBeNotified || followeeData.Likes;
  return usersToBeNotified;
};

/**
 * @description creates a notification dynamically by using configuration parameters
 * @param  {integer} notificationObjectId - selects the response message and entity tablei.e novels
 * @param  {integer} usersToBeNotified - array of users that should be notified
 * @returns {Promise} - returns a promise, resolves to true
 */
const createUsersNotification = (notificationObjectId, usersToBeNotified) => {
  const bulkNotificationData = usersToBeNotified.map(userToBeNotified => ({
    notificationObjectId,
    notifierId: userToBeNotified.followerId || userToBeNotified.userId,
    isRead: false
  }));
  return Notification.bulkCreate(bulkNotificationData, { returning: true });
};

/**
 * @description creates a notification dynamically by using configuration parameters
 * @param  {integer} configObjectId - selects the response message and entity tablei.e novels
 * @param  {integer} entityId - (optional)selects the entity we are notifying about
 * @param  {integer} actorId - The initiator of the notification, if ignored followeeId is use
 * @param  {integer} followerId - the id of the entity users follow
 * @param  {boolean} isSingle - add notification to the followee or his followers, defaults to true
 * @returns {boolean} - returns true when all went well
 */
const addNotification = async ({
  configObjectId, entityId, followeeId, actorId = null, isSingle = true, response
}) => {
  if (actorId === followeeId && isSingle) {
    return;
  }
  try {
    const entityConfigurationObject = getEntityConfigurationObject(configObjectId);
    let usersToBeNotified = null;
    if (isSingle) {
      usersToBeNotified = [{ userId: followeeId }];
    } else {
      usersToBeNotified = await getUsersToBeNotified(entityConfigurationObject, followeeId);
    }
    const notificationObject = await NotificationObject.create({
      entityTypeId: configObjectId, entityId, actorId
    });
    const { id: notificationObjectId } = notificationObject;
    createUsersNotification(notificationObjectId, usersToBeNotified);
    broadcastNotification(notificationObjectId);
    return true;
  } catch (error) {
    responseMessage(response, 500, { error: error.message });
  }
};


export default {
  addNotification,
  getUserNotification,
  broadcastNotification,
  createUsersNotification,
  getUsersToBeNotified,
  buildUserNotificationObject,
  getNovelData,
  getEntityConfigurationObject,
};
