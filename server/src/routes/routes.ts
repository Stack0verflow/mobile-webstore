import { Router, Request, Response, NextFunction } from 'express';
import { MainClass } from '../main-class';
import { PassportStatic } from 'passport';
import { User } from '../model/User';
import { Model_ } from '../model/Model';
import { Product } from '../model/Product';
import { Order } from '../model/Order';
import multer from 'multer';
import { randomBytes } from 'crypto';

// save files to memory, not to disk
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const configureRoutes = (
    passport: PassportStatic,
    router: Router
): Router => {
    //#region auth
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
                    res.status(400).send({
                        message:
                            'This email address is already used by someone.',
                    });
                } else {
                    res.status(500).send('Signup was not successful.');
                }
            });
    });

    router.get('/logout', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            req.logout((error) => {
                if (error) {
                    console.error(error);
                    res.status(500).send('Internal server error.');
                }
                res.status(200).send({ message: 'Successfully logged out.' });
            });
        } else {
            res.status(400).send('User is not logged in.');
        }
    });

    router.get('/get-user', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            res.status(200).send(req.user);
        } else {
            res.status(401).send(null);
        }
    });

    router.post('/admin-auth', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const userParsed = JSON.parse(req.body.user);
            const query = User.findOne({ uuid: userParsed.uuid });
            query.then((dbUser) => {
                if (
                    !userParsed.adminToken ||
                    userParsed.adminToken !== dbUser?.adminToken
                ) {
                    res.status(401).send(false);
                } else {
                    res.status(200).send(true);
                }
            });
        } else {
            res.status(401).send(false);
        }
    });
    //#endregion

    //#region model
    router.post('/model/get-one', (req: Request, res: Response) => {
        const uuid = req.body.uuid;

        if (!uuid) {
            res.status(400).send('No uuid given.');
        } else {
            const query = Model_.findOne({ uuid });
            query
                .then((data) => {
                    res.status(200).json(data);
                })
                .catch((error) => {
                    console.log(error);
                    res.status(500).send('Server error.');
                });
        }
    });

    router.get('/model/get-all', (req: Request, res: Response) => {
        const query = Model_.find();
        query
            .then((data) => {
                res.status(200).send(data);
            })
            .catch((error) => {
                console.log(error);
                res.status(500).send('Server error.');
            });
    });

    router.post('/model/create', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const {
                user,
                name,
                colors,
                pictures,
                brand,
                details,
                basePrice,
                storages,
            } = req.body;

            const userParsed = JSON.parse(user);
            const colorsArray = JSON.parse(colors);
            const picturesArray = JSON.parse(pictures);
            const detailsParsed = JSON.parse(details);
            const storagesArray = JSON.parse(storages);

            const query = User.findOne({ uuid: userParsed.uuid });
            query
                .then((dbUser) => {
                    if (
                        !userParsed.adminToken ||
                        userParsed.adminToken !== dbUser?.adminToken
                    ) {
                        res.status(401).send('Unauthorized action!');
                    } else if (
                        !name ||
                        !Array.isArray(colorsArray) ||
                        (Array.isArray(colorsArray) &&
                            colorsArray.length === 0) ||
                        !Array.isArray(picturesArray) ||
                        (Array.isArray(picturesArray) &&
                            picturesArray.length === 0) ||
                        !brand ||
                        !detailsParsed ||
                        !Array.isArray(storagesArray) ||
                        (Array.isArray(storagesArray) &&
                            storagesArray.length === 0) ||
                        !basePrice
                    ) {
                        res.status(400).send(
                            'Missing required fields to create model.'
                        );
                    } else if (colorsArray.length !== picturesArray.length) {
                        res.status(400).send(
                            'Colors and pictures count must match.'
                        );
                    } else {
                        const newModel = new Model_({
                            uuid: null,
                            name,
                            colors: colorsArray,
                            pictures: picturesArray,
                            brand,
                            details: {
                                cpu: {
                                    speed: detailsParsed.cpu.speed,
                                    cores: detailsParsed.cpu.cores,
                                },
                                display: {
                                    diameter: detailsParsed.display.diameter,
                                    resolution:
                                        detailsParsed.display.resolution,
                                    technology:
                                        detailsParsed.display.technology,
                                    refreshRate:
                                        detailsParsed.display.refreshRate,
                                    colorDepth:
                                        detailsParsed.display.colorDepth,
                                },
                                camera: {
                                    backResolution:
                                        detailsParsed.camera.backResolution,
                                    backMaxZoom:
                                        detailsParsed.camera.backMaxZoom,
                                    frontResolution:
                                        detailsParsed.camera.frontResolution,
                                    autofocus: detailsParsed.camera.autofocus,
                                    flashlight: detailsParsed.camera.flashlight,
                                    recordingMaxResolution:
                                        detailsParsed.camera
                                            .recordingMaxResolution,
                                },
                                memory: {
                                    ram: detailsParsed.memory.ram,
                                    storages: storagesArray,
                                },
                                network: {
                                    simType: detailsParsed.network.simType,
                                    dualSim: detailsParsed.network.dualSim,
                                    '5g': detailsParsed.network['5g'],
                                },
                                connection: {
                                    usb: detailsParsed.connection.usb,
                                    jack: detailsParsed.connection.jack,
                                    wifi: detailsParsed.connection.wifi,
                                    bluetooth:
                                        detailsParsed.connection.bluetooth,
                                    nfc: detailsParsed.connection.nfc,
                                },
                                physical: {
                                    height: detailsParsed.physical.height,
                                    width: detailsParsed.physical.width,
                                    depth: detailsParsed.physical.depth,
                                    weight: detailsParsed.physical.weight,
                                },
                                battery: detailsParsed.battery,
                                os: detailsParsed.os,
                            },
                            basePrice,
                        });

                        newModel
                            .save()
                            .then((data) => {
                                for (let i = 0; i < colorsArray.length; i++) {
                                    const newProduct = new Product({
                                        serial: Math.floor(
                                            Math.random() * 1_000_000_000
                                        ).toString(),
                                        model_: data.uuid,
                                        name,
                                        color: colorsArray[i],
                                        picture: picturesArray[i],
                                        storage:
                                            storagesArray[
                                                i % storagesArray.length
                                            ],
                                        price: basePrice,
                                        warranty: '24',
                                        quantity: 0,
                                    });

                                    newProduct
                                        .save()
                                        .then()
                                        .catch((error) => {
                                            console.error(error);
                                        });
                                }

                                res.status(201).send(data);
                            })
                            .catch((error) => {
                                console.error(error);
                                res.status(500).send(
                                    'Saving the model was not successful.'
                                );
                            });
                    }
                })
                .catch((error) => {
                    console.log(error);
                    res.status(500).send('Server error.');
                });
        } else {
            res.status(400).send('User is not logged in.');
        }
    });

    router.post('/model/update', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const {
                user,
                uuid,
                name,
                colors,
                pictures,
                brand,
                details,
                basePrice,
                storages,
            } = req.body;

            const userParsed = JSON.parse(user);
            const colorsArray = JSON.parse(colors);
            const picturesArray = JSON.parse(pictures);
            const detailsParsed = JSON.parse(details);
            const storagesArray = JSON.parse(storages);

            const query = User.findOne({ uuid: userParsed.uuid });
            query
                .then((dbUser) => {
                    if (
                        !userParsed.adminToken ||
                        userParsed.adminToken !== dbUser?.adminToken
                    ) {
                        res.status(401).send('Unauthorized action!');
                    } else if (
                        !name ||
                        !uuid ||
                        !Array.isArray(colorsArray) ||
                        (Array.isArray(colorsArray) &&
                            colorsArray.length === 0) ||
                        !Array.isArray(picturesArray) ||
                        (Array.isArray(picturesArray) &&
                            picturesArray.length === 0) ||
                        !brand ||
                        !detailsParsed ||
                        !Array.isArray(storagesArray) ||
                        (Array.isArray(storagesArray) &&
                            storagesArray.length === 0) ||
                        !basePrice
                    ) {
                        res.status(400).send(
                            'Missing required fields to create model.'
                        );
                    } else if (colorsArray.length !== picturesArray.length) {
                        res.status(400).send(
                            'Colors and pictures count must match.'
                        );
                    } else {
                        const newModel = {
                            uuid: uuid,
                            name,
                            colors: colorsArray,
                            pictures: picturesArray,
                            brand,
                            details: {
                                cpu: {
                                    speed: detailsParsed.cpu.speed,
                                    cores: detailsParsed.cpu.cores,
                                },
                                display: {
                                    diameter: detailsParsed.display.diameter,
                                    resolution:
                                        detailsParsed.display.resolution,
                                    technology:
                                        detailsParsed.display.technology,
                                    refreshRate:
                                        detailsParsed.display.refreshRate,
                                    colorDepth:
                                        detailsParsed.display.colorDepth,
                                },
                                camera: {
                                    backResolution:
                                        detailsParsed.camera.backResolution,
                                    backMaxZoom:
                                        detailsParsed.camera.backMaxZoom,
                                    frontResolution:
                                        detailsParsed.camera.frontResolution,
                                    autofocus: detailsParsed.camera.autofocus,
                                    flashlight: detailsParsed.camera.flashlight,
                                    recordingMaxResolution:
                                        detailsParsed.camera
                                            .recordingMaxResolution,
                                },
                                memory: {
                                    ram: detailsParsed.memory.ram,
                                    storages: storagesArray,
                                },
                                network: {
                                    simType: detailsParsed.network.simType,
                                    dualSim: detailsParsed.network.dualSim,
                                    '5g': detailsParsed.network['5g'],
                                },
                                connection: {
                                    usb: detailsParsed.connection.usb,
                                    jack: detailsParsed.connection.jack,
                                    wifi: detailsParsed.connection.wifi,
                                    bluetooth:
                                        detailsParsed.connection.bluetooth,
                                    nfc: detailsParsed.connection.nfc,
                                },
                                physical: {
                                    height: detailsParsed.physical.height,
                                    width: detailsParsed.physical.width,
                                    depth: detailsParsed.physical.depth,
                                    weight: detailsParsed.physical.weight,
                                },
                                battery: detailsParsed.battery,
                                os: detailsParsed.os,
                            },
                            basePrice,
                        };

                        const query = Model_.findOneAndUpdate(
                            { uuid },
                            newModel
                        );

                        query
                            .then((data) => {
                                res.status(200).send(data);
                            })
                            .catch((error) => {
                                console.error(error);
                                res.status(500).send(
                                    'Saving the model was not successful.'
                                );
                            });
                    }
                })
                .catch((error) => {
                    console.log(error);
                    res.status(500).send('Server error.');
                });
        } else {
            res.status(400).send('User is not logged in.');
        }
    });

    router.post('/model/delete', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const { user, uuid } = req.body;
            const userParsed = JSON.parse(user);

            const query = User.findOne({ uuid: userParsed.uuid });
            query.then((dbUser) => {
                if (
                    !userParsed.adminToken ||
                    userParsed.adminToken !== dbUser?.adminToken
                ) {
                    res.status(401).send('Unauthorized action!');
                } else {
                    const query = Model_.findOneAndDelete({ uuid });
                    query
                        .then((model) => {
                            const query = Product.deleteMany({
                                model_: model?.uuid,
                            });
                            query.then(() => {
                                res.status(200).send({
                                    message: 'Model deleted successfully.',
                                });
                            });
                        })
                        .catch((error) => {
                            console.log(error);
                            res.status(500).send('Internal server error.');
                        });
                }
            });
        } else {
            res.status(400).send('User is not logged in.');
        }
    });
    //#endregion

    //#region product
    router.post('/product/get-by-serial', (req: Request, res: Response) => {
        const serial = req.body.serial;

        if (!serial) {
            res.status(400).send('No serial number given.');
        }

        const query = Product.findOne({ serial });
        query
            .then((data) => {
                res.status(200).send(data);
            })
            .catch((error) => {
                console.log(error);
                res.status(500).send('Server error.');
            });
    });

    router.post('/product/get-by-selection', (req: Request, res: Response) => {
        const model = req.body.model;
        const color = req.body.color;
        const storage = req.body.storage;

        if (!model || !color || !storage) {
            res.status(400).send('Missing required fields to get product.');
        }

        const query = Product.findOne({ color, storage, model_: model });
        query
            .then((data) => {
                res.status(200).send(data);
            })
            .catch((error) => {
                console.log(error);
                res.status(500).send('Server error.');
            });
    });

    router.get('/product/get-all', (req: Request, res: Response) => {
        const query = Product.find();
        query
            .then((data) => {
                res.status(200).send(data);
            })
            .catch((error) => {
                console.log(error);
                res.status(500).send('Server error.');
            });
    });

    router.post('/product/create', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const {
                serial,
                model,
                name,
                color,
                picture,
                storage,
                price,
                warranty,
            } = req.body;

            // Validate required fields
            if (
                !serial ||
                !model ||
                !name ||
                !color ||
                !picture ||
                !storage ||
                !price ||
                !warranty
            ) {
                res.status(400).send('Missing required product fields.');
            }

            // Create the product
            const newProduct = new Product({
                serial,
                model,
                name,
                color,
                picture,
                storage,
                price,
                warranty,
                quantity: 0,
            });

            newProduct
                .save()
                .then((data) => {
                    res.status(201).send(data);
                })
                .catch((error) => {
                    console.error(error);
                    res.status(500).send(
                        'Saving the product was not successful.'
                    );
                });
        } else {
            res.status(400).send('User is not logged in.');
        }
    });

    router.post('/product/update', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const { user, serial, price, warranty, quantity } = req.body;

            const userParsed = JSON.parse(user);

            const query = User.findOne({ uuid: userParsed.uuid });
            query
                .then((dbUser) => {
                    if (
                        !userParsed.adminToken ||
                        userParsed.adminToken !== dbUser?.adminToken
                    ) {
                        res.status(401).send('Unauthorized action!');
                    } else if (!serial || !price || !warranty || !quantity) {
                        res.status(400).send(
                            'Missing required product fields.'
                        );
                    } else {
                        const query = Product.findOneAndUpdate(
                            { serial },
                            {
                                $set: {
                                    price,
                                    warranty,
                                    quantity,
                                },
                            },
                            { new: true }
                        );

                        query
                            .then((data) => {
                                res.status(200).send(data);
                            })
                            .catch((error) => {
                                console.error(error);
                                res.status(500).send(
                                    'Updating the product was not successful.'
                                );
                            });
                    }
                })
                .catch((error) => {
                    console.log(error);
                    res.status(500).send('Server error.');
                });
        } else {
            res.status(400).send('User is not logged in.');
        }
    });
    //#endregion

    //#region order
    router.post('/order/get-one', (req: Request, res: Response) => {
        const uuid = req.body.uuid;

        if (!uuid) {
            res.status(400).send('No uuid given.');
        }

        const query = Order.findOne({ uuid });
        query
            .then((data) => {
                res.status(200).send(data);
            })
            .catch((error) => {
                console.log(error);
                res.status(500).send('Server error.');
            });
    });

    router.get('/order/get-all', (req: Request, res: Response) => {
        const query = Order.find();
        query
            .then((data) => {
                res.status(200).send(data);
            })
            .catch((error) => {
                console.log(error);
                res.status(500).send('Server error.');
            });
    });

    router.post('/order/create', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const {
                user,
                contact,
                products,
                shippingAddress,
                shippingMethod,
                billingAddress,
                paymentMethod,
                total,
            } = req.body;

            const userParsed = JSON.parse(user);
            const contactParsed = JSON.parse(contact);
            const productsArray = JSON.parse(products);
            const shippingAddressParsed = JSON.parse(shippingAddress);
            const billingAddressParsed = JSON.parse(billingAddress);

            if (
                !userParsed ||
                !contactParsed ||
                !productsArray ||
                !shippingAddressParsed ||
                !shippingMethod ||
                !billingAddressParsed ||
                !paymentMethod ||
                !total
            ) {
                res.status(400).send('Missing required order fields.');
            } else {
                const newOrder = new Order({
                    uuid: null,
                    user: userParsed.uuid,
                    contact: {
                        email: contactParsed.email,
                        phone: contactParsed.phone,
                    },
                    products: productsArray,
                    shippingAddress: shippingAddressParsed,
                    shippingMethod: shippingMethod,
                    billingAddress: billingAddressParsed,
                    paymentMethod: paymentMethod,
                    paymentStatus: 'paid',
                    total,
                    orderTime: new Date(),
                    status: 'ordered',
                    deliveryTime: null,
                    estimatedDelivery: new Date(
                        Date.now() + 3 * 24 * 60 * 60 * 1000
                    ),
                    paymentTime: new Date(),
                    shippingTime: null,
                    transactionId: randomBytes(16).toString('hex'),
                    confirmationTime: null,
                });

                newOrder
                    .save()
                    .then((data) => {
                        const query = Product.updateMany(
                            { serial: { $in: productsArray } },
                            { $inc: { quantity: -1 } }
                        );

                        query
                            .then(() => {
                                res.status(201).send(data);
                            })
                            .catch(() => {
                                res.status(500).send(
                                    'An error occurred during ordering.'
                                );
                            });
                    })
                    .catch((error) => {
                        console.error(error);
                        res.status(500).send(
                            'Saving the order was not successful.'
                        );
                    });
            }
        } else {
            res.status(400).send('User is not logged in.');
        }
    });
    //#endregion

    return router;
};
