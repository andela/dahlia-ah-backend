import express from 'express';
import middlewares from '../middlewares';
import userController from '../controllers/userController';
import novelController from '../controllers/novelController';

const {
  userValidator: {
    profileValidator,
    editProfileValidator,
    validateUUID,
    validateCreateUser,
    followUserValidator,
    validateUpdateUser,
    validateEmailNotificationSettings
  },
  verifyToken,
  authorizeUser
} = middlewares;

const {
  getProfile, editProfile, createUser, listUsers, getUser,
  follow, unfollow, updateUser, deleteUser, getReadingStats, userSettings
} = userController;

const { getAuthorStats } = novelController;

const user = express.Router();

const USER_URL = '/users';
const PROFILE_URL = '/profiles';

// Route for user settings
user.patch(`${USER_URL}/setting`, verifyToken, validateEmailNotificationSettings, userSettings);

// Route to get most liked novels
user.get(`${PROFILE_URL}/:userId/novels`, validateUUID, verifyToken, authorizeUser(['author', 'admin', 'superadmin']), getAuthorStats);
// Route to get info of novels read by user

user.get(`${PROFILE_URL}/readingstats`, verifyToken, authorizeUser(['author', 'admin', 'superadmin']), getReadingStats);
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
user.patch(`${USER_URL}/:userId`, validateUUID, validateUpdateUser, verifyToken, authorizeUser(['admin', 'superadmin']), updateUser);
user.delete(`${USER_URL}/:userId`, validateUUID, verifyToken, authorizeUser(['superadmin']), deleteUser);


export default user;
