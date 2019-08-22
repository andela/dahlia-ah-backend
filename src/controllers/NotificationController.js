import helpers from '../helpers';
import services from '../services';

const { notificationServices: { getUserNotification } } = services;


const { responseMessage } = helpers;

const getNotification = async (req, res) => {
  const { id } = req.user;
  try {
    const userNotificationObject = await getUserNotification(id);
    responseMessage(res, 200, { notifications: userNotificationObject });
  } catch (error) {
    responseMessage(res, 500, { error: error.message });
  }
};

export default getNotification;
