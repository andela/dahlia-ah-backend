import services from '../services';
import helpers from '../helpers';
import models from '../database/models';

const { novelServices: { createNewNovel, findAllNovels } } = services;
const {
  errorResponse, successResponse, extractNovels, responseMessage
} = helpers;
const { Novel } = models;

/**
 * createNovel
 *
 * @param {object} req
 * @param {object} res
 * @returns {object} json
 */
const createNovel = async (req, res) => {
  const newNovel = req.body;
  const createdNovel = await createNewNovel(newNovel, req.user);
  if (createdNovel.error) {
    return errorResponse(res, createdNovel.status, createdNovel.error);
  }
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

export default { createNovel, getNovels };
