import express from 'express';
import createNovel from '../controllers/novelController';
import middlewares from '../middlewares';

const { novelValidator, verifyToken } = middlewares;

const validate = novelValidator.createNovel;

const novel = express.Router();

novel.post('/novels', validate, verifyToken, createNovel);

export default novel;
