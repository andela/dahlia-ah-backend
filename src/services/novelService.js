import { Op } from 'sequelize';
import models from '../database/models';
import helpers from '../helpers';

const {
  Genre, Novel, Like, User, Highlight, Bookmark, readStats
} = models;
const { generateReadTime } = helpers;

/**
 * Finds a novel from the database by slug
 * @param {string} param
 * @returns {object} a novel object
 */

const findNovel = async (param) => {
  const novel = await Novel.findOne({
    where: { slug: param },
    include: [{ model: Genre, attributes: ['name'] }, { model: User, attributes: ['id', 'firstName', 'lastName', 'bio', 'avatarUrl'] }],
  });
  return novel;
};

/**
 * Finds a novelLikes from the database by userid and novelId
 * @param {string} userId
 * @param {string} novelId
 * @returns {object}
 */

const findNovelLike = (userId, novelId) => Like.findOne({
  where: {
    [Op.and]: [{ userId }, { novelId }]
  }
});

/**
 * Finds a novel from the database by id
 * @param {string} param
 * @returns {object} a novel object
 */

const findNovelById = param => Novel.findOne({
  where: { id: param }
});

/**
 * deletes particular novelLikes record from the table by userid and novelId
 * @param {string} userId
 * @param {string} novelId
 * @returns {object}
 */

const removeNovelLike = (userId, novelId) => Like.destroy({
  where: {
    [Op.and]: [{ userId }, { novelId }]
  }
});

/**
 *
 *
 * @param {string} userId
 * @param {string} novelId
 * @returns {object} json
 */
const bookmarkNovel = async (userId, novelId) => {
  const createBookmark = await Bookmark.create({
    userId,
    novelId
  });
  return {
    novelId: createBookmark.novelId,
    title: createBookmark.title,
    updatedAt: createBookmark.updatedAt
  };
};

/**
 *
 *
 * @param {string} userId
 * @returns {object} json
 */
const getAllBookmark = async (userId) => {
  const bookmarks = await Bookmark.findAll({
    where: { userId }
  });
  return bookmarks;
};

/**
 *
 *
 * @param {object} novel
 * @param {object} author
 * @returns {object} json
 */
const addNovel = async (novel, author) => {
  const {
    genre,
    title,
    description,
    body
  } = novel;
  const getGenre = await Genre.findOne({ where: { name: genre } });
  const slug = `${title.toLowerCase().split(' ').join('-')}-${author.id}`;
  const foundNovel = await Novel.findOne({ where: { slug } });
  const generatedReadTime = generateReadTime(body);
  const readTime = (generatedReadTime > 0) ? generatedReadTime : 1;
  if (foundNovel) {
    return {
      status: 409,
      error: 'You already have a novel with this title'
    };
  }

  const createdNovel = await Novel.create({
    authorId: author.id,
    genreId: getGenre.id,
    slug,
    title,
    description,
    body,
    readTime
  });
  return {
    id: createdNovel.id,
    slug: createdNovel.slug,
    title: createdNovel.title,
    description: createdNovel.description,
    body: createdNovel.body,
    genre,
    author: `${author.firstName} ${author.lastName}`,
    readTime,
    createdAt: createdNovel.createdAt,
    updatedAt: createdNovel.updatedAt
  };
};

/**
 *
 * @param {object} offset
 * @param {object} limit
 * @returns {object} json
 */
const findAllNovels = async (offset, limit) => {
  const novels = await Novel.findAll({
    offset,
    limit,
    include: [{ model: User }, { model: Genre }]
  });
  return novels;
};

/**
 * @name highlightNovelText
 * @param {Integer} novelId
 * @param {Integer} readerId
 * @param {Object} highlight
 * @returns {Object} created highlight
 */
const highlightNovelText = async (novelId, readerId, highlight) => {
  const {
    startIndex,
    endIndex,
    comment
  } = highlight;

  const createdHighlight = await Highlight.create({
    novelId,
    readerId,
    startIndex,
    endIndex,
    comment
  });

  return createdHighlight.dataValues;
};

/**
 * @name getNovelHighlights
 * @param {object} novel
 * @param {integer} readerId
 * @returns {array} highlight array
 */
const getNovelHighlights = async (novel, readerId) => {
  let highlight;
  if (novel.authorId === readerId) {
    highlight = await Highlight.findAll({
      where: { novelId: novel.id }
    });
  } else {
    highlight = await Highlight.findAll({
      where: { novelId: novel.id, readerId }
    });
  }
  return highlight;
};

/*
 * Finds a genre from the database by name
 * @name sendMail
 * @param {string} name
 * @returns {object} a user object
 */
const findGenre = async (name) => {
  const genre = await Genre.findOne({ where: { name } });
  return genre;
};

/**
 * @name updateNovel
 * @param {string} slug
 * @param {object} fields
 * @param {object} user
 * @returns {object} updated novel
 */
const updateNovel = async ({ slug }, fields, user) => {
  const novel = await findNovel(slug);
  if (!novel) {
    return {
      status: 404,
      error: 'Novel not found'
    };
  }
  if (novel.authorId !== user.id) {
    return {
      status: 403,
      error: 'You cannot edit this book'
    };
  }
  const updatedNovel = await Novel.update({
    ...fields
  }, {
    where: { slug },
    returning: true,
    raw: true
  });
  return updatedNovel[1][0];
};

/**
 *
 * @name removeNovel
 * @param {string} slug
 * @param {object} user
 * @returns {object} deleted novel
 */
const removeNovel = async ({ slug }, user) => {
  const novel = await findNovel(slug);
  if (!novel) {
    return {
      status: 404,
      error: 'Novel not found'
    };
  }
  if (novel.authorId !== user.id) {
    return {
      status: 403,
      error: 'You cannot delete this book'
    };
  }
  await Novel.destroy({
    where: { slug }
  });
  return true;
};

/**
 *
 * @param {object} userId - user id
 * @param {object} novelId - novel id
 * @param {object} readStatus - property from request body
 * @returns {object} object
 */
const toggleReadStatus = async (userId, novelId, readStatus) => {
  readStatus = readStatus === 'true';
  if (!readStatus) {
    await readStats.destroy({ where: { userId, novelId } });
    return 'removed as read';
  }
  const read = await readStats.findOne({
    where: { userId, novelId }
  });
  if (read) {
    return 'marked as read';
  }
  await readStats.create({
    userId, novelId
  }, {
    where: { userId }
  });
  return 'marked as read';
};


export default {
  findGenre,
  findNovel,
  addNovel,
  findNovelById,
  updateNovel,
  removeNovel,
  findNovelLike,
  removeNovelLike,
  findAllNovels,
  highlightNovelText,
  getNovelHighlights,
  bookmarkNovel,
  getAllBookmark,
  toggleReadStatus,
};
