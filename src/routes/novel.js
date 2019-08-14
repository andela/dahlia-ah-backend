import express from 'express';
import middlewares from '../middlewares';
import updateLikes from '../controllers/likesController';
import novelController from '../controllers/novelController';

const {
  novelValidator: {
    createNovelValidator, getNovelBySlugValidator, getNovelValidator, genreValidator
  },
  verifyToken,
  authorizeUser
} = middlewares;
const {
  createNovel, getNovel, getNovels, createGenre
} = novelController;
const novel = express.Router();
const NOVEL_URL = '/novels';

// Route to create a novel
novel.post(`${NOVEL_URL}`, verifyToken, authorizeUser(['author', 'admin', 'superadmin']), createNovelValidator, createNovel);

// Route to like a novel
novel.post(`${NOVEL_URL}/:slug/like`, verifyToken, authorizeUser(['author', 'admin', 'superadmin']), updateLikes);

// Route to create a genre
novel.post('/genres', verifyToken, authorizeUser(['author', 'admin', 'superadmin']), genreValidator, createGenre);

// Route to get all novels
novel.get(`${NOVEL_URL}`, verifyToken, getNovelValidator, getNovels);

// Route to get novel by slug
novel.get(`${NOVEL_URL}/:slug`, verifyToken, authorizeUser(['reader', 'author', 'admin', 'superadmin']), getNovelBySlugValidator, getNovel);

export default novel;
