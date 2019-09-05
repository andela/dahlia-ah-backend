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
    email: `${user.oauthId}@gmail.com`,
    password: user.oauthId,
    avatarUrl: user.profileImage,
    isVerified: true,
  };

  try {
    let dbUser = await User.findOne({
      where: { password: user.oauthId }
    });

    if (!dbUser) {
      dbUser = await User.create(userData);
    }

    const payload = {
      id: dbUser.id,
      email: '',
      token: authHelper.generateToken({ id: dbUser.id }),
      bio: dbUser.bio,
      image: dbUser.avatar,
      isVerified: dbUser.isVerified,
      firstName: dbUser.firstName,
      lastName: dbUser.lastName,
      avatarUrl: dbUser.avatarUrl,
    };
    const token = authHelper.generateToken(payload);

    return res.redirect(`${process.env.FRONTEND_OAUTH_CALLBACK}?token=${token}`);
  } catch (e) {
    return res.redirect(`${process.env.FRONTEND_OAUTH_CALLBACK}`);
  }
};
export default controller;
