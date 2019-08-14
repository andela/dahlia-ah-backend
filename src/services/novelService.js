import { Op } from 'sequelize';
import models from '../database/models';
import helpers from '../helpers';

const {
  Genre, Novel, Like, User
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
 * Finds a novel from the database by id
 * @param {string} param
 * @returns {object} a novel object
 */

const findNovelById = param => Novel.findOne({
  where: { id: param }
});

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
 * @param {object} queryFilter
 * @returns {object} json
 */
const findAllNovels = async (offset, limit, queryFilter) => {
  const novels = await Novel.findAll({
    offset,
    limit,
    ...queryFilter
  });
  return novels;
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

export default {
  findGenre,
  findNovel,
  addNovel,
  findNovelById,
  findNovelLike,
  removeNovelLike,
  findAllNovels
};
