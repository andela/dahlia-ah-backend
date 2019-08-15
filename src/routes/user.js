import express from 'express';
import middlewares from '../middlewares';
import userController from '../controllers/userController';

const {
  userValidator: {
    signUpValidator, loginValidator, profileValidator, editProfileValidator
  },
  verifyToken
} = middlewares;
const {
  signUp, login, getProfile, editProfile
} = userController;
const user = express.Router();

const USER_URL = '/users';
const PROFILE_URL = '/profiles';

// Route to sign up a user
user.post(`${USER_URL}`, signUpValidator, signUp);

// Route to login a user
user.post(`${USER_URL}/login`, loginValidator, login);

// Route to get user profile by userId
user.get(`${PROFILE_URL}/:userId`, verifyToken, profileValidator, getProfile);

// Route to edit a user profile
user.patch(`${PROFILE_URL}`, verifyToken, editProfileValidator, editProfile);

export default user;
