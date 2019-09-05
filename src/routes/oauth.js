import express from 'express';
import passport from 'passport';
import socialController from '../controllers/social';

const router = express.Router();

router.get('/oauth/facebook', passport.authenticate('facebook', { session: false }));
router.get('/oauth/facebook/callback', passport.authenticate('facebook', { session: false }), socialController);

router.get('/oauth/google', passport.authenticate('google', { session: false, scope: ['openid', 'profile', 'email'] }));
router.get('/oauth/google/callback', passport.authenticate('google', { session: false }), socialController);

export default router;
