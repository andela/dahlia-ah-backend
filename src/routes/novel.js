import express from 'express';
import novelController from '../controllers/novelController';
import middlewares from '../middlewares';
import updateLikes from '../controllers/likesController';

const {
  novelValidator: {
    createNovelValidator, getNovelBySlugValidator, getNovelValidator,
    createGenreValidator, getGenreValidator, editNovelValidator, markReadValidator,
    getRandomNovelValidator
  },
  highlightValidator: { createHighlightValidator },
  verifyToken,
  authorizeUser,
} = middlewares;
const {
  createNovel, getNovels, createGenre, getGenres,
  getSingleNovel, highlightNovel, postBookmark,
  fetchBookmarks, editNovel, deleteNovel, toggleRead,
  getRandomNovels, getNovelOfTheWeek
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

// Route to add bookmark
novel.post(`${NOVEL_URL}/:novelId/bookmarks`, verifyToken, postBookmark);

// Route to get bookmark
novel.get(`${NOVEL_URL}/bookmarks`, verifyToken, fetchBookmarks);

// Route to get novels
novel.get(`${NOVEL_URL}`, verifyToken, getNovelValidator, getNovels);

// Route to get random novels
novel.get(`${NOVEL_URL}/random`, getRandomNovelValidator, getRandomNovels);

// Route to get novel of the week
novel.get('/noveloftheweek', getNovelOfTheWeek);

// Route to get novel by slug
novel.get(`${NOVEL_URL}/:slug`, verifyToken, authorizeUser(['reader', 'author', 'admin', 'superadmin']), getNovelBySlugValidator, getSingleNovel);

// Route to post highlight
novel.post(`${NOVEL_URL}/:slug/highlight`, createHighlightValidator, verifyToken, highlightNovel);

// Route to mark novel as read
novel.patch(`${NOVEL_URL}/:slug/markread`, verifyToken, markReadValidator, authorizeUser(['author', 'admin', 'superadmin']), toggleRead);

export default novel;
