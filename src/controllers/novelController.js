import createNewNovel from '../services/createNovel';
import helpers from '../helpers';


const { errorResponse, successResponse } = helpers;

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

export default createNovel;
