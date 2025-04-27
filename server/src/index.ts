import { MainClass } from './main-class';
import express from 'express';
import { Request, Response } from 'express';
import { configureRoutes } from './routes/routes';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import passport from 'passport';
import { configurePassport } from './passport/passport';
import mongoose from 'mongoose';
import cors from 'cors';

// config
const app = express();
const port = 8080;
const dbPassword = 'admin1234';
const dbUrl =
    'mongodb+srv://admin:' +
    dbPassword +
    '@mobilewebstore.oxuqbcm.mongodb.net/?retryWrites=true&w=majority&appName=MobileWebstore';

// mongodb connection
mongoose
    .connect(dbUrl, {
        dbName: 'Webstore',
    })
    .then((_) => {
        console.log('Successfully connected to MongoDB.');
    })
    .catch((error) => {
        console.log(error);
        return;
    });

// cors
const whitelist = ['*', 'http://localhost:4200'];
const corsOptions = {
    origin: (
        origin: string | undefined,
        callback: (err: Error | null, allowed?: boolean) => void
    ) => {
        if (whitelist.indexOf(origin!) !== -1 || whitelist.includes('*')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS.'));
        }
    },
    credentials: true,
};
app.use(cors(corsOptions));

// parsers
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// session
const sessionOptions: expressSession.SessionOptions = {
    secret: 'mobilesecret',
    resave: false,
    saveUninitialized: false,
};
app.use(expressSession(sessionOptions));

// passport
app.use(passport.initialize());
app.use(passport.session());
configurePassport(passport);

// routing
app.use('/app', configureRoutes(passport, express.Router()));

// starting server
app.listen(port, () => {
    console.log('Server is listening on port ' + port.toString());
});
console.log('Server setup finished.');
