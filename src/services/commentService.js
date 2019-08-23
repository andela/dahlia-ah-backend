import models from '../database/models';

const { Comment, CommentHistory } = models;

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

/**
 * Update a comment in the database
 * @param {string} param
 * @returns {object} a user object
 */

const updateComment = async (commentId, commentBody) => {
  const updatedComment = await Comment.update(
    { commentBody },
    {
      where: { id: commentId },
      returning: true,
      raw: true
    }
  );
  const commentUpdate = updatedComment[1][0];
  return commentUpdate;
};

/**
 * insert edited comment in the database
 * @param {string} commentId
* @param {string} commentBody
 * @returns {object} a user object
 */
const insertEditedComment = async (commentId, commentBody) => {
  const insertedComment = await CommentHistory.create({ commentId, commentBody });
  return insertedComment;
};

/**
 * @param {string} commentId
 * @returns {object} json
 */
const getOldComments = commentId => CommentHistory.findAll({ where: { commentId } });

export default {
  findComment, createComment, updateComment, getOldComments, insertEditedComment
};
