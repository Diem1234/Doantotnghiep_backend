
import   jwtSettings   from '../database/jwtSetting.js';
import { Account } from '../models/Account.js';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';


const jwtSecret = 'mysecretkey';
export const passportConfigAccount = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
    secretOrKey: jwtSecret,
  },
  async (payload, done) => {
    console.log('««««« account »»»»»');
    try {
      const user = await Account.findById(payload._id).select('-password');

      if (!user) return done(null, false);

      return done(null, user);
    } catch (error) {
      done(error, false);
    }
  },
);

export const passportConfigLocalAccount = new LocalStrategy(
  {
    usernameField: 'email',
  },
  async (email, password, done) => {
    try {
      console.log('««««« account »»»»»');
      const user = await Account.findOne({ email });

      if (!user) return done(null, false);

      const isCorrectPass = await user.isValidPass(password);

      if (!isCorrectPass) return done(null, false);

      return done(null, user);
    } catch (error) {
      done(error, false);
    }
  },
);


