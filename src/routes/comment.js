import express from 'express';
import commentController from '../controllers/commentController';
import middlewares from '../middlewares';

const comment = express.Router();
const COMMENT_URL = '/novels/:slug/comments';

const { verifyToken, commentValidator, authorizeUser } = middlewares;
const {
  postComment, replyComment, fetchCommentHistory, editComment
} = commentController;

// Route to create a comment
comment.post(`${COMMENT_URL}`, verifyToken, commentValidator.postComment, authorizeUser(['author', 'admin', 'superadmin']), postComment);

// Route to reply a comment
comment.post(`${COMMENT_URL}/:parentId`, verifyToken, commentValidator.replyComment, authorizeUser(['author', 'admin', 'superadmin']), replyComment);

// comment history
comment.get(`${COMMENT_URL}/:commentId`, verifyToken, commentValidator.getEditedComment, fetchCommentHistory);
comment.patch(`${COMMENT_URL}/:commentId`, verifyToken, commentValidator.editComment, editComment);

export default comment;
