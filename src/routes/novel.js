import express from 'express';
import createNovel from '../controllers/novelController';
import middlewares from '../middlewares';
import updateLikes from '../controllers/likesController';

const { novelValidator, verifyToken, authorizeUser } = middlewares;

const validate = novelValidator.createNovel;

const novel = express.Router();

// Route to create a novel
novel.post('/novels', validate, verifyToken, authorizeUser(['author', 'admin', 'superadmin']), createNovel);
novel.post('/novels/:slug/like', verifyToken, authorizeUser(['author', 'admin', 'superadmin']), updateLikes);

export default novel;
