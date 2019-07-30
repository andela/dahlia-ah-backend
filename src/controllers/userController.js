import models from '../database/models';
import { authHelper, responseHelper } from '../helpers/index';

/**
   *
   * @param {Object} req - server request
   * @param {Object} res - server response
   * @returns {Object} - custom response
   */
const signUp = async (req, res) => {
  const {
    firstName, lastName, username, email, password
  } = req.body;

  const foundEmail = await models.User.findOne({ where: { email } });
  const foundUsername = await models.User.findOne({ where: { username } });

  if (foundEmail) {
    const data = {
      errors: [{
        field: 'email',
        message: 'user with email already exists'
      }]
    };
    return responseHelper.successResponse(res, 409, data);
  }

  if (foundUsername) {
    const data = {
      errors: [{
        field: 'username',
        message: 'username already taken'
      }]
    };
    return responseHelper.successResponse(res, 409, data);
  }

  const user = {
    firstName,
    lastName,
    username,
    email,
    password: authHelper.hashedPassword(password)
  };

  const createdUser = await models.User.create(user);

  return res.status(201).json({
    status: res.statusCode,
    user: {
      email: createdUser.email,
      token: authHelper.generateToken({ id: createdUser.id }),
      username: createdUser.username,
      bio: createdUser.bio,
      image: createdUser.avatar
    }
  });
};


export default signUp;
