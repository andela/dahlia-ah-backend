import authHelper from './authHelper';
import { successResponse, errorResponse } from './responseHelper';
import emptyBody from './emptyBody';
import emailMessages from './emailMessages';
import responseMessage from './responseMessage';
import validators from './validator';
import verifyUser from './verifyUser';
import notificationConfig from './notificationConfig';
import novelHelpers from './novelHelpers';

const { forgotPasswordMessage, emailNotificationMessage } = emailMessages;

export default {
  authHelper,
  successResponse,
  errorResponse,
  emptyBody,
  forgotPasswordMessage,
  responseMessage,
  validators,
  verifyUser,
  emailNotificationMessage,
  notificationConfig,
  novelHelpers
};
