import express from 'express';
import middlewares from '../middlewares';
import updateLikes from '../controllers/likesController';
import novelController from '../controllers/novelController';

const {
  novelValidator: {
    createNovelValidator, getNovelBySlugValidator, getNovelValidator,
    createGenreValidator, getGenreValidator, editNovelValidator
  },
  highlightValidator: { createHighlightValidator },
  verifyToken,
  authorizeUser,
} = middlewares;
const {
  createNovel, getNovels, createGenre, getGenres,
  getSingleNovel, highlightNovel, postBookmark, fetchBookmarks, editNovel, deleteNovel
} = novelController;

const novel = express.Router();
const NOVEL_URL = '/novels';
const GENRE_URL = '/genres';

// Route to create a novel
novel.post(`${NOVEL_URL}`, verifyToken, authorizeUser(['author', 'admin', 'superadmin']), createNovelValidator, createNovel);

// Route to edit a novel
novel.patch(`${NOVEL_URL}/:slug`, editNovelValidator, verifyToken, authorizeUser(['author', 'admin', 'superadmin']), editNovel);

// Route to delete a novel
novel.delete(`${NOVEL_URL}/:slug`, verifyToken, authorizeUser(['author', 'admin', 'superadmin']), deleteNovel);

// Route to like a novel
novel.post(`${NOVEL_URL}/:slug/like`, verifyToken, authorizeUser(['author', 'admin', 'superadmin']), updateLikes);

// Route to create a genre
novel.post(`${GENRE_URL}`, verifyToken, authorizeUser(['author', 'admin', 'superadmin']), createGenreValidator, createGenre);

// Route to get all genres
novel.get(`${GENRE_URL}`, verifyToken, getGenreValidator, getGenres);

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
