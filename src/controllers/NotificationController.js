import helpers from '../helpers';
import services from '../services';

const { notificationServices: { getUserNotification, markAsRead: markAsReadService } } = services;


const { responseMessage } = helpers;

export const getNotification = async (req, res) => {
  const { id } = req.user;
  try {
    const userNotificationObject = await getUserNotification(id);
    return responseMessage(res, 200, { notifications: userNotificationObject });
  } catch (error) {
    return responseMessage(res, 500, { error: error.message });
  }
};

export const markAsRead = async (req, res) => {
  const { id: userId } = req.user;
  const id = req.params.id || null;
  try {
    await markAsReadService(id, userId);
    return responseMessage(res, 200, { message: 'Notification was mark as read successfully' });
  } catch (error) {
    return responseMessage(res, 500, { error: 'Something went wrong' });
  }
};
