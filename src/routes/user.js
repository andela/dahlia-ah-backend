import express from 'express';
import userValidator from '../middlewares/userValidator';
import signUp from '../controllers/userController';

const user = express.Router();

const middlewares = [userValidator.signUp];

user.post('/users', middlewares, signUp);

export default user;
