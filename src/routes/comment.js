import express from 'express';
import commentController from '../controllers/commentController';
import middlewares from '../middlewares';

const comment = express.Router();
const COMMENT_URL = '/novels/:slug/comments';
const CommentLikeUrl = '/comment/:commentId/like';

const {
  postComment, replyComment, fetchCommentHistory, editComment, getComment, likeComment
} = commentController;
const {
  verifyToken, authorizeUser,
  commentValidator: {
    getCommentValidator, postCommentValidator,
    replyCommentValidator, getEditedComment, editCommentValidator
  }
} = middlewares;

// Route to get a comment and like count
comment.get(`${COMMENT_URL}`, verifyToken, authorizeUser(['author', 'admin', 'superadmin']), getCommentValidator, getComment);

// Route to create a comment
comment.post(`${COMMENT_URL}`, verifyToken, authorizeUser(['author', 'admin', 'superadmin']), postCommentValidator, postComment);

// Route to reply a comment
comment.post(`${COMMENT_URL}/:parentId`, verifyToken, authorizeUser(['author', 'admin', 'superadmin']), replyCommentValidator, replyComment);

// Route to get comment history
comment.get(`${COMMENT_URL}/:commentId`, verifyToken, getEditedComment, fetchCommentHistory);

// Route to like a comment
comment.post(`${CommentLikeUrl}`, verifyToken, likeComment);

// Route to update a comment
comment.patch(`${COMMENT_URL}/:commentId`, verifyToken, editCommentValidator, editComment);

export default comment;
