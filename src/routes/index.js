import express from 'express';
import usersRoute from './users';

const router = express.Router();

router.use('/api/users', usersRoute);

export default router;
