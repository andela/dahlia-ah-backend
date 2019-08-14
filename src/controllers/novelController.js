import models from '../database/models';
import services from '../services';
import helpers from '../helpers';

const {
  errorResponse, successResponse, novelHelpers: { extractNovels, filter }, responseMessage
} = helpers;
const { Novel } = models;
const {
  novelServices: {
    addNovel, findGenre, findNovel, findAllNovels
  },
  notificationServices: { addNotification }
} = services;

const { Genre } = models;

/**
 * createNovel
 *
 * @param {object} req
 * @param {object} res
 * @returns {object} json
 */
const createNovel = async (req, res) => {
  const newNovel = req.body;
  const createdNovel = await addNovel(newNovel, req.user);
  if (createdNovel.error) {
    return errorResponse(res, createdNovel.status, createdNovel.error);
  }
  const config = {
    configObjectId: 0,
    entityId: createdNovel.id,
    followeeId: req.user.id,
    isSingle: false,
    response: res
  };
  addNotification(config);
  return successResponse(res, 201, {
    message: 'Novel created successfully',
    novel: {
      ...createdNovel
    }
  });
};

/**
 * getNovels
 *
 * @param {object} request
 * @param {object} response
 * @returns {object} json
 */
const getNovels = async (request, response) => {
  const {
    title, author, genre, keyword, page = 1, limit = 20
  } = request.query;
  const standardQueries = title || author || genre;
  const queryFilter = filter(title, genre, author, keyword);
  try {
    if (keyword && standardQueries) {
      return responseMessage(response, 400, {
        error: 'keyword cannot be used with title, author or genre'
      });
    }
    const { count } = await Novel.findAndCountAll(queryFilter);
    if (!count) {
      return responseMessage(response, 404, { message: 'no novels found in database', data: [] });
    }
    const pages = Math.ceil(count / limit);
    if (page > pages) {
      return responseMessage(response, 404, { error: 'page not found' });
    }
    const offset = limit * (page - 1);
    const results = await findAllNovels(offset, limit, queryFilter);
    const novels = extractNovels(results);
    response.status(200).json({
      message: 'succesfully returned novels',
      currentPage: page,
      totalPages: pages,
      limit,
      data: novels
    });
  } catch (error) {
    responseMessage(response, 500, { error: error.message });
  }
};

/**
 * @description creates a genre
 * @param {object} request express request object
 * @param {object} response express response object
 * @param {object} next express next argument
 * @returns {json} json
 */
const createGenre = async (request, response) => {
  try {
    const { name } = request.body;
    const nameValue = name.toLowerCase();
    const existingGenre = await findGenre(nameValue);
    if (existingGenre) {
      const genreName = existingGenre.dataValues;
      return responseMessage(response, 200, {
        data: { genre: { name: genreName.name } }
      });
    }
    const createdGenre = await Genre.create({ name: nameValue });
    const { dataValues } = createdGenre;
    return responseMessage(response, 201, {
      message: 'genre successfully created',
      data: { genre: { name: dataValues.name } }
    });
  } catch (error) {
    return responseMessage(response, 500, { error: error.message });
  }
};

/**
 * @description returns novel with slug
 * @param {object} request express request object
 * @param {object} response express response object
 * @param {object} next express next argument
 * @returns {json} json
 */
const getNovel = async (request, response) => {
  try {
    const { slug } = request.params;
    const novel = await findNovel(slug);
    if (!novel) {
      return responseMessage(response, 404, { error: 'novel not found' });
    }
    return responseMessage(response, 200, { novel });
  } catch (error) {
    responseMessage(response, 500, { error: error.message });
  }
};

export default {
  createNovel, getNovel, getNovels, createGenre
};
