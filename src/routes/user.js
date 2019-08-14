import express from 'express';
import middlewares from '../middlewares';
import userController from '../controllers/userController';

const {
  userValidator: {
    signUpValidator, loginValidator, profileValidator
  },
  verifyToken
} = middlewares;
const { signUp, login, getProfile } = userController;
const user = express.Router();

// Route to sign up a user
user.post('/users', signUpValidator, signUp);

// Route to login a user
user.post('/users/login', loginValidator, login);

// Route to get user profile by userId
user.get('/profiles/:userId', verifyToken, profileValidator, getProfile);

export default user;
