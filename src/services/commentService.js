import { Op } from 'sequelize';
import models from '../database/models';

const { Comment, CommentHistory, CommentLike } = models;

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

const createCommentLike = async (userId, commentId) => {
  await CommentLike.create({
    userId,
    commentId
  });
};

const findCommentLike = async (userId, commentId) => CommentLike.findOne({
  where: {
    [Op.and]: [{ userId }, { commentId }]
  }
});

const deleteCommentLike = async (userId, commentId) => CommentLike.destroy({
  where: {
    [Op.and]: [{ userId }, { commentId }]
  }
});

export default {
  findComment,
  createComment,
  createCommentLike,
  findCommentLike,
  deleteCommentLike,
  updateComment,
  getOldComments,
  insertEditedComment
};
