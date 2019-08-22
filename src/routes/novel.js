import express from 'express';
import middlewares from '../middlewares';
import updateLikes from '../controllers/likesController';
import novelController from '../controllers/novelController';

const novel = express.Router();

const { novelValidator, verifyToken, authorizeUser } = middlewares;
const { createNovel, getNovels } = novelController;
const validate = novelValidator.createNovel;


// Route to create a novel
novel.post('/novels', validate, verifyToken, authorizeUser(['author', 'admin', 'superadmin']), createNovel);
novel.post('/novels/:slug/like', verifyToken, authorizeUser(['author', 'admin', 'superadmin']), updateLikes);

// getNovels route
novel.get('/novels', verifyToken, novelValidator.getNovels, getNovels);

export default novel;
