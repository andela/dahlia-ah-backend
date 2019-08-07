import helpers from '../helpers';
import services from '../services';

const { responseMessage } = helpers;
const { novelServices: { findNovel }, commentServices: { findComment, createComment } } = services;

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
    const newComment = await createComment(commentBody, userId, parentCommentId, novelId);
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

export default {
  postComment, replyComment
};
