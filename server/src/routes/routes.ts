import { Router, Request, Response, NextFunction } from 'express';
import { MainClass } from '../main-class';
import { PassportStatic } from 'passport';
import { User } from '../model/User';

export const configureRoutes = (
    passport: PassportStatic,
    router: Router
): Router => {
    router.post('/login', (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate(
            'local',
            (error: string | null, user: typeof User) => {
                if (error) {
                    res.status(500).send(error);
                } else {
                    if (!user) {
                        res.status(400).send('User not found.');
                    } else {
                        req.login(user, (err: string | null) => {
                            if (err) {
                                console.error(err);
                                res.status(500).send('Internal server error.');
                            } else {
                                res.status(200).send(user);
                            }
                        });
                    }
                }
            }
        )(req, res, next);
    });

    router.post('/signup', (req: Request, res: Response) => {
        const uuid = null;
        const email = req.body.email;
        const password = req.body.password;
        const adminToken = null;
        const user = new User({
            uuid: uuid,
            email: email,
            password: password,
            adminToken: adminToken,
        });
        user.save()
            .then((data) => {
                res.status(200).send(data);
            })
            .catch((error) => {
                if (error.code && error.code.toString() === '11000') {
                    res.status(400).send(
                        'This email address is already used by someone.'
                    );
                } else {
                    res.status(500).send('Signup was not successful.');
                }
            });
    });

    router.post('/logout', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            req.logout((error) => {
                if (error) {
                    console.error(error);
                    res.status(500).send('Internal server error.');
                }
                res.status(200).send('Successfully logged out.');
            });
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    return router;
};
