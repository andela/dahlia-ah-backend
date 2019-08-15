import express from 'express';
import commentController from '../controllers/commentController';
import middlewares from '../middlewares';

const comment = express.Router();
const COMMENT_URL = '/novels/:slug/comments';

const { verifyToken, commentValidator, authorizeUser } = middlewares;
const { postComment, replyComment } = commentController;

// Route to create a comment
comment.post(`${COMMENT_URL}`, verifyToken, commentValidator.postComment, authorizeUser(['author', 'admin', 'superadmin']), postComment);

// Route to reply a comment
comment.post(`${COMMENT_URL}/:parentId`, verifyToken, commentValidator.replyComment, authorizeUser(['author', 'admin', 'superadmin']), replyComment);

export default comment;
