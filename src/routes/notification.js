import express from 'express';
import middlewares from '../middlewares';
import { getNotification, markAsRead } from '../controllers/NotificationController';

const { verifyToken, notificationValidator } = middlewares;

const notification = express.Router();

notification.get('/notifications', verifyToken, getNotification);
notification.patch('/notification/:id?', verifyToken, notificationValidator.markAsRead, markAsRead);

export default notification;
