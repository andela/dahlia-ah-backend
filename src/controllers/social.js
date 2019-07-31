import dotenv from 'dotenv';
import models from '../database/models';
import authHelper from '../helpers/authHelper';

dotenv.config();

const { User } = models;

const controller = async (req, res) => {
  const { user } = req;
  const userData = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email || '',
    password: user.oauthId,
    username: user.firstName + user.lastName,
    avatarUrl: user.profileImage
  };

  let dbUser = await User.findOne({
    where: { password: user.oauthId }
  });

  if (!dbUser) {
    dbUser = await User.create(userData);
  }

  const payload = {
    id: dbUser.id,
    email: dbUser.email
  };

  const token = authHelper.generateToken(payload);

  return res.json({
    firstName: user.firstName,
    lastName: user.lastName,
    token
  });
};
export default controller;
