import express from 'express';
import AuthController from '../controllers/AuthController';

const auth = express.Router();

const BASE_URL = '/auth';
const { forgotPassword } = AuthController;

// forgot password endpoint
auth.post(`${BASE_URL}/forgotpassword`, forgotPassword);

export default auth;
