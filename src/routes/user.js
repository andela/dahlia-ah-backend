import express from 'express';
import userValidator from '../middlewares/userValidator';

const user = express.Router();

const middlewares = [userValidator.signUp];

user.post('/users', middlewares, (req, res) => res.send({
  status: 200,
  message: req.body
}));

export default user;
