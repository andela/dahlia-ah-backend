import express from 'express';
import UsersController from '../controllers/usersController';

const usersRouter = express.Router();

usersRouter.post('/', UsersController.signUp);
usersRouter.post('/login', UsersController.login);


export default usersRouter;
