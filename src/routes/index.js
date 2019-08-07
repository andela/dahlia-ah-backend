import express from 'express';
import user from './user';
import auth from './auth';
import novel from './novel';
import comment from './comment';

const router = express.Router();

router.use('/', user, auth, novel, comment);

export default router;
