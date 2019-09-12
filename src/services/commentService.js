import Sequelize from 'sequelize';
import models from '../database/models';

const { Op } = Sequelize;
const {
  Comment, CommentHistory, CommentLike, User
} = models;

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
 * Finds all comment from the database by novel id
 * @param {string} novelId
 * @returns {object} a comment object
 */

const findComments = async (novelId) => {
  const comment = await Comment.findAll({
    where: { novelId },
    attributes: {
      include: [[Sequelize.fn('COUNT', Sequelize.col('CommentLikes.commentId')), 'likesCount']],
      exclude: ['parentId', 'novelId', 'userId']
    },
    include: [
      { model: User, as: 'commentAuthor', attributes: ['firstName', 'lastName', 'avatarUrl'] },
      { model: CommentLike, attributes: [] },
      {
        model: Comment,
        as: 'replies',
        attributes: {
          include: [[Sequelize.fn('COUNT', Sequelize.col('CommentLikes.commentId')), 'likesCount']],
          exclude: ['parentId', 'novelId', 'userId']
        },
        include: [
          { model: User, as: 'commentAuthor', attributes: ['firstName', 'lastName', 'avatarUrl'] },
          { model: CommentLike, attributes: [] }],
        separate: true,
        group: ['Comment.id', 'commentAuthor.id'],
        order: [['Comment', 'createdAt', 'ASC']]
      }
    ],
    group: ['Comment.id', 'commentAuthor.id'],
    order: [['Comment', 'createdAt', 'ASC']]
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
  findComments,
  createComment,
  createCommentLike,
  findCommentLike,
  deleteCommentLike,
  updateComment,
  getOldComments,
  insertEditedComment
};
