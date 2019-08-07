import express from 'express';
import middlewares from '../middlewares';
import getNotification from '../controllers/NotificationController';

const { verifyToken } = middlewares;

const notification = express.Router();

notification.get('/notifications', verifyToken, getNotification);

export default notification;
