import { Op } from 'sequelize';
import models from '../database/models';

const { Genre, Novel, Likes } = models;

/**
 * Finds a novel from the database by slug
 * @param {string} param
 * @returns {object} a novel object
 */

const findNovel = async (param) => {
  const novel = await Novel.findOne({
    where: { slug: param }
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

const findNovelLike = (userId, slug) => Likes.findOne({
  where: {
    [Op.and]: [{ userId }, { slug }]
  }
});

/**
 * deletes particular novelLikes record from the table by userid and novelId
 * @param {string} userId
 * @param {string} novelId
 * @returns {object}
 */

const removeNovelLike = (userId, slug) => Likes.destroy({
  where: {
    [Op.and]: [{ userId }, { slug }]
  }
});

/**
 *
 *
 * @param {object} novel
 * @param {object} author
 * @returns {object} json
 */
const createNewNovel = async (novel, author) => {
  const {
    genre,
    title,
    description,
    body
  } = novel;
  const getGenre = await Genre.findOne({ where: { name: genre } });
  const slug = `${title.toLowerCase().split(' ').join('-')}-${author.id}`;
  const foundNovel = await Novel.findOne({ where: { slug } });
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
    body
  });
  return {
    id: createdNovel.id,
    slug: createdNovel.slug,
    title: createdNovel.title,
    description: createdNovel.description,
    body: createdNovel.body,
    genre,
    author: `${author.firstName} ${author.lastName}`,
    createdAt: createdNovel.createdAt,
    updatedAt: createdNovel.updatedAt
  };
};

export default {
  findNovel,
  createNewNovel,
  findNovelById,
  findNovelLike,
  removeNovelLike
};
