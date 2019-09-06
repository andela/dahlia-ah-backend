import express from 'express';
import AuthController from '../controllers/AuthController';
import userController from '../controllers/userController';
import middlewares from '../middlewares';


const auth = express.Router();

const { signUp, login } = userController;
const AUTH_URL = '/auth';

const { userValidator, userValidator: { resetPasswordValidator }, verifyToken } = middlewares;
const {
  forgotPassword, updateStatus, logOut, changePassword, resetPassword, resendMail
} = AuthController;

// forgot password endpoint
auth.post(`${AUTH_URL}/forgotpassword`, userValidator.forgotPassword, forgotPassword);
// change password route
auth.post(`${AUTH_URL}/changepassword`, verifyToken, userValidator.changePassword, changePassword);
// verifyUser route
auth.patch(`${AUTH_URL}/verify/:token`, verifyToken, updateStatus);

auth.post(`${AUTH_URL}/register`, userValidator.signUpValidator, signUp);
auth.post(`${AUTH_URL}/login`, userValidator.loginValidator, login);
auth.get(`${AUTH_URL}/logout`, verifyToken, logOut);
auth.patch(`${AUTH_URL}/passwordreset`, resetPasswordValidator, verifyToken, resetPassword);
auth.patch(`${AUTH_URL}/verify/resend/:id`, resendMail);

export default auth;
