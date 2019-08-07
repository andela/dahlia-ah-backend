import express from 'express';
import commentController from '../controllers/commentController';
import middlewares from '../middlewares';

const comment = express.Router();
const COMMENT_URL = '/novels/:slug/comments';

const { verifyToken, commentValidator } = middlewares;
const { postComment, replyComment } = commentController;

// create comment endpoint
comment.post(`${COMMENT_URL}`, verifyToken, commentValidator.postComment, postComment);

// reply a comment
comment.post(`${COMMENT_URL}/:parentId`, verifyToken, commentValidator.replyComment, replyComment);

export default comment;
