import { use } from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { model } from 'mongoose';

const User = model('User');

use(
  new LocalStrategy(
    {
      usernameField: 'user[email]',
      passwordField: 'user[password]'
    },
    ((email, password, done) => {
      User.findOne({ email })
        .then((user) => {
          if (!user || !user.validPassword(password)) {
            return done(null, false, {
              errors: { 'email or password': 'is invalid' }
            });
          }

          return done(null, user);
        })
        .catch(done);
    })
  )
);
