import model from '../database/models';
import helpers from '../helpers';
import services from '../services';

const { novelServices: { findNovel, findNovelLike, removeNovelLike } } = services;
const { successResponse, errorResponse } = helpers;
const { Like } = model;

/**
 *
 *
 * @param {object} request
 * @param {object} response
 * @returns {json} - json
 */

const updateLikes = async (req, res) => {
  const { user, user: { id }, params: { slug } } = req;

  const novel = await findNovel(slug);

  if (!user || !novel) {
    return errorResponse(res, 404, 'user or novel does not exist');
  }

  const novelId = novel.id;

  const likeExist = await findNovelLike(id, novelId);

  if (likeExist) {
    await removeNovelLike(id, novelId);
    return successResponse(res, 201, { message: 'you\'ve succesfully unliked this book' });
  }

  await Like.create({
    userId: id,
    novelId,
  });

  return successResponse(res, 201, { message: 'you\'ve succesfully liked this book' });
};

export default updateLikes;
