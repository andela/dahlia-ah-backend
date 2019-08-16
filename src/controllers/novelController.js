import models from '../database/models';
import services from '../services';
import helpers from '../helpers';

const {
  errorResponse, successResponse, novelHelpers: { extractNovels, filter }, responseMessage
} = helpers;
const { Novel } = models;
const {
  novelServices: {
    addNovel, findGenre, findNovel, findAllNovels,
    highlightNovelText, getNovelHighlights
  },
  notificationServices: { addNotification }
} = services;

const { Genre } = models;

/**
 * @name createNovel
 * @param {object} request
 * @param {object} response
 * @returns {object} json
 */
const createNovel = async (request, response) => {
  const newNovel = request.body;
  const createdNovel = await addNovel(newNovel, request.user);
  if (createdNovel.error) {
    return errorResponse(response, createdNovel.status, createdNovel.error);
  }
  const config = {
    configObjectId: 0,
    entityId: createdNovel.id,
    followeeId: request.user.id,
    isSingle: false,
    response
  };
  addNotification(config);
  return successResponse(response, 201, {
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
 *
 *
 * @name getSingleNovel
 * @param {object} request
 * @param {object} response
 * @returns {object} json
 */
const getSingleNovel = async (request, response) => {
  const {
    params: { slug },
    user: { id: userId }
  } = request;
  try {
    const novel = await findNovel(slug);
    if (!novel) {
      return responseMessage(response, 404, { error: 'Novel not found' });
    }
    const highlights = await getNovelHighlights(novel, userId);
    if (highlights.length > 0) {
      return responseMessage(response, 200, {
        message: 'Request successful',
        novel,
        highlights
      });
    }
    return responseMessage(response, 200, {
      message: 'Request successful',
      novel
    });
  } catch (error) {
    return responseMessage(response, 500, { error: error.message });
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
 * @name highlightNovel
 * @param {object} request
 * @param {object} response
 * @returns {object} json
*/
const highlightNovel = async (request, response) => {
  const {
    body: highlight,
    user: { id: userId },
    params: { slug }
  } = request;
  try {
    const novel = await findNovel(slug);
    if (!novel) {
      return responseMessage(response, 404, { error: 'Novel not found' });
    }
    const createdHighlight = await highlightNovelText(novel.id, userId, highlight);
    return successResponse(response, 201, {
      message: 'Text highlighted successfully',
      highlight: {
        ...createdHighlight
      }
    });
  } catch (error) {
    return responseMessage(response, 500, { error: error.message });
  }
};

export default {
  createNovel,
  getNovels,
  createGenre,
  highlightNovel,
  getSingleNovel
};
