import express from 'express';
import userValidator from '../middlewares/userValidator';
import { signUp, login } from '../controllers/userController';

const user = express.Router();

const middlewares = [userValidator.signUp];
const loginValidator = [userValidator.login];

user.post('/users', middlewares, signUp);
user.post('/users/login', loginValidator, login);

export default user;
