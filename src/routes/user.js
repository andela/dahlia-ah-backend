import express from 'express';
import middlewares from '../middlewares';
import userController from '../controllers/userController';

const {
  userValidator: {
    profileValidator,
    editProfileValidator,
    validateUUID,
    validateCreateUser,
    followUserValidator
  },
  verifyToken,
  authorizeUser
} = middlewares;

const {
  getProfile, editProfile, createUser, listUsers, getUser, follow, unfollow
} = userController;
const user = express.Router();

const USER_URL = '/users';
const PROFILE_URL = '/profiles';

// Route to get user profile by userId
user.get(`${PROFILE_URL}/:userId`, verifyToken, authorizeUser(['reader', 'author', 'admin', 'superadmin']), profileValidator, getProfile);


// Route to edit a user profile
user.patch(`${PROFILE_URL}`, verifyToken, authorizeUser(['reader', 'author', 'admin', 'superadmin']), editProfileValidator, editProfile);
user.post(`${USER_URL}`, verifyToken, authorizeUser(['superadmin']), validateCreateUser, createUser);
// Route to get all users
user.get(`${USER_URL}`, verifyToken, listUsers);
user.get(`${USER_URL}/:userId`, verifyToken, authorizeUser(['admin', 'superadmin']), validateUUID, getUser);

user.post('/profiles/:userId/follow', followUserValidator, verifyToken, follow);
user.delete('/profiles/:userId/follow', followUserValidator, verifyToken, unfollow);

export default user;
