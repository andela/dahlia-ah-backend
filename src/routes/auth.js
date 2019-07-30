import express from 'express';
import AuthController from '../controllers/AuthController';
import middlewares from '../middlewares';

const auth = express.Router();
const AUTH_URL = '/auth';

const { userValidator } = middlewares;
const { forgotPassword } = AuthController;

// forgot password endpoint
auth.post(`${AUTH_URL}/forgotpassword`, userValidator.forgotPassword, forgotPassword);

export default auth;
