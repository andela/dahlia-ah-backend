import jwt from 'jsonwebtoken';
import pages from './emailMessages';
import mailer from '../services/sendMail';
import model from '../database/models';

const { User } = model;
const { VerifyAccountEmailPage } = pages;

/**
 * supplies subject and html page for email
 * @name msg
 * @param {Array} userName
 * @returns {object} subject and html page for email
 */

const msg = (...userName) => ({
  subject: 'Authors Haven - Verify Account',
  html: VerifyAccountEmailPage(userName),
});

/**
 * verify user helper function
 * @name verifyUser
 * @param {object} info
 */

const verifyUser = async (info) => {
  const { id, firstName, email } = info;
  const token = jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: '5h' });
  await User.update({
    verifiedToken: token
  }, {
    where: {
      id,
    }
  });
  const url = `http://dahlia-ah-frontend-staging.herokuapp.com/confirmation-page?token=${token}`;
  const message = msg(firstName, url);
  mailer(process.env.HOST_EMAIL, email, message);
};

export default verifyUser;
