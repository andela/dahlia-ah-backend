import Sequelize from 'sequelize';
import debug from 'debug';
import models from '../database/models';
import services from '../services';
import helpers from '../helpers';

const log = debug('dev');

const { Op } = Sequelize;
const {
  errorResponse, successResponse, novelHelpers: { extractNovels, filter }, responseMessage
} = helpers;
const {
  Novel, Genre, User, Like
} = models;
const {
  novelServices: {
    addNovel, findGenre, findNovel, findAllNovels,
    highlightNovelText, getNovelHighlights, findRandomNovels,
    findNovelById, bookmarkNovel, getAllBookmark,
    updateNovel, removeNovel, toggleReadStatus, findNovelOfTheWeek,
    getNovelStats
  },
  notificationServices: { addNotification }
} = services;

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
 * getRandomNovels
 *
 * @param {object} request
 * @param {object} response
 * @returns {object} json
 */
const getRandomNovels = async (request, response) => {
  const { limit = 1 } = request.query;
  try {
    const existingNovel = await findRandomNovels(limit);
    if (!existingNovel) {
      return responseMessage(response, 404, { message: 'no novels found in database', data: [] });
    }
    const novels = extractNovels(existingNovel);
    response.status(200).json({
      message: 'successfully returned novels',
      data: novels
    });
  } catch (error) {
    responseMessage(response, 500, { error: error.message });
  }
};

/**
 * getNovelOfTheWeek
 *
 * @param {object} request
 * @param {object} response
 * @returns {object} json
 */
const getNovelOfTheWeek = async (request, response) => {
  try {
    const existingNovel = await findNovelOfTheWeek();
    if (!existingNovel) {
      return responseMessage(response, 404, { message: 'no novels found in database', data: [] });
    }
    const novels = extractNovels(existingNovel);
    response.status(200).json({
      message: 'successfully returned novels',
      data: novels[0]
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
 *
 *
 * @name editNovel
 * @param {object} request
 * @param {object} response
 * @returns {object} json
 */
const editNovel = async (request, response) => {
  const {
    body,
    params: slug,
    user
  } = request;
  try {
    const editedNovel = await updateNovel(slug, body, user);
    if (editedNovel.error) {
      return responseMessage(response, editedNovel.status, { error: editedNovel.error });
    }
    return responseMessage(response, 200, {
      message: 'Novel updated successfully',
      novel: {
        ...editedNovel
      }
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
    const {
      name, description, coverImgUrl, themeColor
    } = request.body;
    const nameValue = name.toLowerCase();
    const existingGenre = await findGenre(nameValue);
    if (existingGenre) {
      const genreName = existingGenre.dataValues;
      return responseMessage(response, 200, {
        data: { genre: { name: genreName.name } }
      });
    }
    const createdGenre = await Genre.create({
      name: nameValue, description, coverImgUrl, themeColor
    });
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

/**
 * createBookmark
 * @param {object} req
 * @param {object} res
 * @returns {object} json
 */

const postBookmark = async (req, res) => {
  const { novelId } = req.params;
  const {
    id: userId
  } = req.user;

  try {
    const novel = await findNovelById(novelId);
    if (!novel) {
      return responseMessage(res, 404, { error: 'novel not found' });
    }

    const newBookmark = await bookmarkNovel(userId, novel.id);
    res.status(201).json({
      bookmark: {
        novelId: novel.id,
        title: novel.title,
        updatedAt: newBookmark.updatedAt
      }
    });
  } catch (error) {
    return responseMessage(res, 500, { error: error.message });
  }
};

/**
 * getAllBookmark
 * @param {object} req
 * @param {object} res
 * @returns {object} json
 */

const fetchBookmarks = async (req, res) => {
  const {
    id: userId
  } = req.user;

  try {
    const bookmarks = await getAllBookmark(userId);
    return successResponse(res, 201, {
      message: 'Bookmarks fetched successfully',
      bookmarks
    });
  } catch (error) {
    return responseMessage(res, 500, { error: error.message });
  }
};
/**
 * @description gets all genre
 * @param {object} request express request object
 * @param {object} response express response object
 * @param {object} next express next argument
 * @returns {json} json
 */
const getGenres = async (request, response) => {
  const { keyword } = request.query;
  const genreFilter = keyword ? { name: { [Op.iLike]: `%${keyword}%` } } : { id: { [Op.ne]: null } };
  try {
    const genreList = await Genre.findAll({
      where: genreFilter,
      attributes: ['id', 'name', 'description', 'coverImgUrl', 'themeColor'],
      include: [{
        model: Novel,
        as: 'novels',
        include: [
          { model: User, attributes: ['firstName', 'lastName'] },
          { model: Like, attributes: [] }],
        attributes: {
          include: [[Sequelize.fn('COUNT', Sequelize.col('novelId')), 'likescount']],
        }
      }],
      group: ['Genre.id', 'novels.id', 'novels->User.id']
    });
    return response.status(200).json({
      message: 'successfully returned genres',
      data: genreList
    });
  } catch (error) {
    responseMessage(response, 500, { error: error.message });
  }
};

/**
 *
 * @name deleteNovel
 * @param {object} request
 * @param {object} response
 * @returns {object} json
 */
const deleteNovel = async (request, response) => {
  const {
    params: slug,
    user
  } = request;
  try {
    const deletedNovel = await removeNovel(slug, user);
    if (deletedNovel.error) {
      return responseMessage(response, deletedNovel.status, { error: deletedNovel.error });
    }
    return responseMessage(response, 200, {
      message: 'Novel deleted successfully'
    });
  } catch (error) {
    responseMessage(response, 500, { error: error.message });
  }
};

/**
 * @description returns novel with slug
 * @param {object} request express request object
 * @param {object} response express response object
 * @param {object} next express next argument
 * @returns {json} json
 */
const toggleRead = async (request, response) => {
  const { slug } = request.params;
  const { readStatus } = request.body;
  try {
    const novel = await findNovel(slug);
    if (!novel) {
      return responseMessage(response, 404, { error: 'novel not found' });
    }
    const status = await toggleReadStatus(request.user.id, novel.id, readStatus);
    return responseMessage(response, 200, { message: status, novel });
  } catch (error) {
    log(error.message);
    responseMessage(response, 500, { error: 'an error occurred' });
  }
};

/**
 * @description return the likes and comment activity of the logged in user
 * @param {object} request express request object
 * @param {object} response express response object
 * @returns {json} json
 */
const getAuthorStats = async (request, response) => {
  try {
    const novelsInfo = await getNovelStats(request.params.userId);

    return responseMessage(response, 200, { data: novelsInfo });
  } catch (error) {
    log(error.message);
    return responseMessage(response, 500, { error: 'an error occurred' });
  }
};

export default {
  createNovel,
  getNovels,
  getRandomNovels,
  getNovelOfTheWeek,
  createGenre,
  getGenres,
  highlightNovel,
  getSingleNovel,
  postBookmark,
  fetchBookmarks,
  editNovel,
  deleteNovel,
  toggleRead,
  getAuthorStats
};
