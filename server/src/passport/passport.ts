import { PassportStatic } from 'passport';
import { Strategy } from 'passport-local';
import { User } from '../model/User';

export const configurePassport = (passport: PassportStatic): PassportStatic => {
    passport.serializeUser((user: Express.User, done) => {
        console.log('User is serialized.');
        done(null, user);
    });

    passport.deserializeUser((user: Express.User, done) => {
        console.log('User is deserialized.');
        done(null, user);
    });

    passport.use(
        'local',
        new Strategy((username, password, done) => {
            done('WIP');
        })
    );

    return passport;
};
