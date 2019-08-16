import express from 'express';
import AuthController from '../controllers/AuthController';
import middlewares from '../middlewares';

const auth = express.Router();
const AUTH_URL = '/auth';

const { userValidator, verifyToken } = middlewares;
const { forgotPassword, updateStatus } = AuthController;

// forgot password endpoint
auth.post(`${AUTH_URL}/forgotpassword`, userValidator.forgotPassword, forgotPassword);
auth.patch(`${AUTH_URL}/verify/:token`, verifyToken, updateStatus);

export default auth;
