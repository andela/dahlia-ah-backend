import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt';
import { OAuth2Strategy as passportGoogle } from 'passport-google-oauth';
import dotenv from 'dotenv';
import callback from './callback';

dotenv.config();

const passportFacebookConfig = {
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL,
  profileFields: ['id', 'displayName', 'name', 'picture.type(large)'],
};

const passportGoogleConfig = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
};

const passportJWTConfig = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY
};

const jwtHandler = (payload, done) => {
  done(null, payload);
};

const setPassportMiddleware = (server) => {
  server.use(passport.initialize());
  passport.use(new FacebookStrategy(passportFacebookConfig, callback));
  passport.use(new passportGoogle(passportGoogleConfig, callback));
  passport.use(new JWTStrategy(passportJWTConfig, jwtHandler));
};

export default setPassportMiddleware;
