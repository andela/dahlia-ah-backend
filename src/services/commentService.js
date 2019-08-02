import models from '../database/models';

const { Comment } = models;

/**
 * Finds a comment from the database by id
 * @param {string} param
 * @returns {object} a user object
 */

const findComment = async (param) => {
  const comment = await Comment.findOne({
    where: { id: param }
  });
  return comment;
};

/**
 * Creates a comment in the database
 * @param {string} param
 * @returns {object} a user object
 */

const createComment = async (commentBody, userId, parentId, novelId) => {
  const createdComment = await Comment.create({
    commentBody, userId, novelId, parentId
  });
  return createdComment;
};

export default {
  findComment, createComment
};
