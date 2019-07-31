import express from 'express';
import user from './user';
import auth from './auth';
import novel from './novel';
import comment from './comment';
import notification from './notification';
import report from './report';
import oauth from './oauth';

const router = express.Router();

router.use('/', user, auth, novel, oauth, comment, notification, report);

export default router;
