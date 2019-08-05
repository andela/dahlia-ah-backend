import express from 'express';
import user from './user';
import auth from './auth';
import novel from './novel';

const router = express.Router();

router.use('/', user, auth, novel);

export default router;
