import express from 'express';
import middlewares from '../middlewares';
import updateLikes from '../controllers/likesController';
import novelController from '../controllers/novelController';

const novel = express.Router();
const NOVEL_URL = '/novels';

const {
  novelValidator: {
    createNovelValidator, getNovelValidator, genreValidator
  },
  verifyToken,
  authorizeUser
} = middlewares;
const { createNovel, getNovels, createGenre } = novelController;

// Route to create a novel
novel.post(`${NOVEL_URL}`, verifyToken, authorizeUser(['author', 'admin', 'superadmin']), createNovelValidator, createNovel);

// Route to like a novel
novel.post(`${NOVEL_URL}/:slug/like`, verifyToken, authorizeUser(['author', 'admin', 'superadmin']), updateLikes);

// Route to create a genre
novel.post('/genres', verifyToken, authorizeUser(['author', 'admin', 'superadmin']), genreValidator, createGenre);

// Route to get novels
novel.get(`${NOVEL_URL}`, verifyToken, getNovelValidator, getNovels);

export default novel;
