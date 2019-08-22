import models from '../database/models';
import services from '../services';
import helpers from '../helpers';

const { Novel } = models;
const {
  novelServices: { addNovel, findGenre, findAllNovels },
  notificationServices: { addNotification }
} = services;
const {
  errorResponse, successResponse,
  extractNovels, responseMessage
} = helpers;
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
  const { page = 1, limit = 20 } = request.query;
  try {
    const { count } = await Novel.findAndCountAll();
    if (!count) {
      return responseMessage(response, 404, { message: 'no novels found in database', data: [] });
    }
    const pages = Math.ceil(count / limit);
    if (page > pages) {
      return responseMessage(response, 404, { error: 'page not found' });
    }
    const offset = limit * (page - 1);
    const results = await findAllNovels(offset, limit);
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

export default { createNovel, getNovels, createGenre };
