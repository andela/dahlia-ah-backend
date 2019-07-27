import models from '../database/models';
import auth from '../helpers/authHelper';

/**
 * UserController class
 */
class UsersController {
  /**
   *
   * @param {Object} req - server request
   * @param {Object} res - server response
   * @returns {Object} - custom response
   */
  static async signUp(req, res) {
    const {
      firstname, lastname, username, email, password
    } = req.body;

    const foundEmail = await models.User.findOne({ where: { email } });
    const foundUsername = await models.User.findOne({ where: { username } });

    if (foundEmail) {
      return res.status(409).json({
        errors: 'user with email already exists'
      });
    }

    if (foundUsername) {
      return res.status(409).json({
        errors: 'username already taken'
      });
    }

    const user = {
      firstname,
      lastname,
      username,
      email,
      password: auth.hashPassword(password)
    };

    const createdUser = await models.User.create(user);

    return res.status(201).json({
      status: res.statusCode,
      user: {
        email: createdUser.email,
        token: auth.generateToken({ id: createdUser.id }),
        username: createdUser.username,
        bio: createdUser.bio,
        image: createdUser.avatarURL
      }
    });
  }

  /**
   *
   * @param {Object} req - server request
   * @param {Object} res - server response
   * @return {Object} - custom response
   */
  static async login(req, res) {
    // find username from databse
    // if exist
    // check password if correct
    // return token
    // else return error message
    const {
      email, password
    } = req.body;

    const authErrorMessage = 'email or password is incorrect';

    const foundUser = await models.User.findOne({ where: { email } });

    if (foundUser) {
      const correctPassword = auth.comparePassword(password, foundUser.password);
      if (correctPassword) {
        return res.status(200).json({
          user: {
            email: foundUser.email,
            token: auth.generateToken({ id: foundUser.id }),
            username: foundUser.username,
            bio: foundUser.bio,
            image: foundUser.avatarURL
          }
        });
      }
      return res.status(401).json({
        errors: authErrorMessage
      });
    }
    return res.status(401).json({
      errors: authErrorMessage
    });
  }
}

export default UsersController;
