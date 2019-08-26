import express from 'express';
import middlewares from '../middlewares';
import updateLikes from '../controllers/likesController';
import novelController from '../controllers/novelController';

const {
  novelValidator: {
    createNovelValidator, getNovelBySlugValidator, getNovelValidator, genreValidator
  },
  highlightValidator: { createHighlightValidator },
  verifyToken,
  authorizeUser,
} = middlewares;
const {
  createNovel, getNovels, createGenre,
  getSingleNovel, highlightNovel, postBookmark, fetchBookmarks
} = novelController;
const novel = express.Router();
const NOVEL_URL = '/novels';

// Route to create a novel
novel.post(`${NOVEL_URL}`, verifyToken, authorizeUser(['author', 'admin', 'superadmin']), createNovelValidator, createNovel);

// Route to like a novel
novel.post(`${NOVEL_URL}/:slug/like`, verifyToken, authorizeUser(['author', 'admin', 'superadmin']), updateLikes);

// Route to create a genre
novel.post('/genres', verifyToken, authorizeUser(['author', 'admin', 'superadmin']), genreValidator, createGenre);

// Route to get bookmark

novel.post(`${NOVEL_URL}/:novelId/bookmarks`, verifyToken, postBookmark);
novel.get(`${NOVEL_URL}/bookmarks`, verifyToken, fetchBookmarks);

// Route to get novels
novel.get(`${NOVEL_URL}`, verifyToken, getNovelValidator, getNovels);

// Route to get novel by slug
novel.get(`${NOVEL_URL}/:slug`, verifyToken, authorizeUser(['reader', 'author', 'admin', 'superadmin']), getNovelBySlugValidator, getSingleNovel);

// Route to post highlight
novel.post(`${NOVEL_URL}/:slug/highlight`, createHighlightValidator, verifyToken, highlightNovel);

export default novel;
