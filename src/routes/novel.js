import express from 'express';
import createNovel from '../controllers/novelController';
import middlewares from '../middlewares';

const { novelValidator, verifyToken, authorizeUser } = middlewares;

const validate = novelValidator.createNovel;

const novel = express.Router();

// Route to create a novel
novel.post('/novels', validate, verifyToken, authorizeUser(['author', 'admin', 'superadmin']), createNovel);

export default novel;
