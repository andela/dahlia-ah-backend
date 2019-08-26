import helpers from '../helpers';
import services from '../services';

const { responseMessage } = helpers;
const {
  novelServices: { findNovel },
  notificationServices: { addNotification },
  commentServices: {
    findComment, createComment, updateComment, getOldComments,
    insertEditedComment, createCommentLike, findCommentLike, deleteCommentLike
  },
} = services;

/**
 *
 * @param {object} request
 * @param {object} response
 * @returns {json} - json
 */
const postComment = async (request, response) => {
  const { commentBody } = request.body;
  const { slug } = request.params;
  const {
    id: userId, firstName, lastName, isSubscribed
  } = request.user;
  try {
    if (!isSubscribed) {
      return responseMessage(response, 403, { error: 'you have to be subscribed to comment on a novel' });
    }
    const novel = await findNovel(slug);
    if (!novel) {
      return responseMessage(response, 404, { error: 'novel not found' });
    }
    const parentCommentId = null;
    const novelId = novel.id;
    const followeeId = novel.authorId;
    const newComment = await createComment(commentBody, userId, parentCommentId, novelId);

    addNotification({
      configObjectId: 2, entityId: newComment.id, actorId: userId, followeeId, response
    });
    response.status(201).json({
      comment: {
        novel: novel.title,
        commenter: `${firstName} ${lastName}`,
        commentBody: newComment.commentBody,
        updatedAt: newComment.updatedAt
      }
    });
  } catch (error) {
    responseMessage(response, 500, { error: error.message });
  }
};

/**
 *
 * @param {object} request
 * @param {object} response
 * @returns {json} - json
 */
const replyComment = async (request, response) => {
  const { commentBody } = request.body;
  const { slug, parentId: parentCommentId } = request.params;
  const {
    id: userId, firstName, lastName, isSubscribed
  } = request.user;
  try {
    if (!isSubscribed) {
      return responseMessage(response, 403, { error: 'you have to be subscribed to reply a comment' });
    }
    const novel = await findNovel(slug);
    if (!novel) {
      return responseMessage(response, 404, { error: 'novel not found' });
    }
    const parentComment = await findComment(parentCommentId);
    if (!parentComment) {
      return responseMessage(response, 404, { error: 'no comment found with the provided id' });
    }
    if (!parentComment.novelId) {
      return responseMessage(response, 403, { error: 'you can only reply a parent comment' });
    }

    const novelId = null;
    const newComment = await createComment(commentBody, userId, parentCommentId, novelId);
    response.status(201).json({
      reply: {
        novel: novel.title,
        parentComment: parentComment.commentBody,
        replier: `${firstName} ${lastName}`,
        replyBody: newComment.commentBody,
        updatedAt: newComment.updatedAt
      }
    });
  } catch (error) {
    responseMessage(response, 500, { error: error.message });
  }
};

/**
 * Finds a comment from the database by commentId
 * @param {string} req
 * @param {string} res
 * @returns {object} json
 */

const fetchCommentHistory = async (req, res) => {
  const { commentId } = req.params;
  const comment = await findComment(commentId);
  if (!comment) {
    return responseMessage(res, 404, { error: 'no comment found with the provided id' });
  }
  const commentHistory = await getOldComments(commentId);
  res.status(200).json({
    commentHistory
  });
};


const editComment = async (req, res) => {
  const { commentId } = req.params;
  const { commentBody } = req.body;
  try {
    const previousComment = await findComment(commentId);
    if (!previousComment) {
      return responseMessage(res, 404, { error: 'previous comment not found' });
    }
    const newComment = await updateComment(commentId, commentBody);
    insertEditedComment(previousComment.id, previousComment.commentBody);
    res.status(200).json({
      message: 'Your comment has been updated successfully',
      comment: {
        commentBody: newComment.commentBody,
        updatedAt: newComment.updatedAt
      }
    });
  } catch (error) {
    responseMessage(res, 500, { error: error.message });
  }
};

const likeComment = async (request, response) => {
  const { user: { id: userId }, params: { commentId } } = request;
  try {
    const commentExist = await findComment(commentId);
    if (!commentExist) {
      return responseMessage(response, 404, { error: 'comment does not exist' });
    }
    const likeExist = await findCommentLike(userId, commentId);
    if (likeExist) {
      await deleteCommentLike(userId, commentId);
      return responseMessage(response, 200, { message: 'you\'ve successfully unliked this comment' });
    }
    await createCommentLike(userId, commentId);
    return responseMessage(response, 200, { message: 'you\'ve successfully liked this comment' });
  } catch (error) {
    return responseMessage(response, 500, { error: error.message });
  }
};

export default {
  postComment, replyComment, likeComment, fetchCommentHistory, editComment
};
