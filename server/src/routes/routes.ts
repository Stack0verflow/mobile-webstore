import { Router, Request, Response, NextFunction } from 'express';
import { MainClass } from '../main-class';
import { PassportStatic } from 'passport';
import { User } from '../model/User';
import { Model_ } from '../model/Model';
import { Product } from '../model/Product';
import { Order } from '../model/Order';
import multer from 'multer';

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
                    const query = Model_.deleteOne({ uuid });
                    query
                        .then((data) => {
                            res.status(200).send(data);
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
                res.status(500).send('Saving the product was not successful.');
            });
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
        const {
            user,
            contact,
            products,
            shippingAddress,
            shippingMethod,
            shippingCost,
            billingAddress,
            paymentMethod,
            paymentStatus,
            subtotal,
            tax,
            total,
            orderTime,
        } = req.body;

        if (
            !user ||
            !contact ||
            !products ||
            !shippingAddress ||
            !shippingMethod ||
            !shippingCost ||
            !billingAddress ||
            !paymentMethod ||
            !paymentStatus ||
            !subtotal ||
            !tax ||
            !total ||
            !orderTime
        ) {
            res.status(400).send('Missing required order fields.');
        }

        if (!(orderTime instanceof Date)) {
            res.status(400).send('Arrival date must be a valid date.');
        }

        const newOrder = new Order({
            uuid: null,
            user,
            contact: {
                email: contact.email,
                phone: contact.phone,
            },
            products,
            shippingAddress: {
                firstName: shippingAddress.firstName,
                lastName: shippingAddress.lastName,
                country: shippingAddress.country,
                city: shippingAddress.city,
                zip: shippingAddress.zip,
                street: shippingAddress.street,
                houseNumber: shippingAddress.houseNumber,
                isPO: shippingAddress.isPO,
            },
            shippingMethod: shippingMethod,
            shippingCost: shippingCost,
            billingAddress: {
                firstName: billingAddress.firstName,
                lastName: billingAddress.lastName,
                country: billingAddress.country,
                city: billingAddress.city,
                zip: billingAddress.zip,
                street: billingAddress.street,
                houseNumber: billingAddress.houseNumber,
            },
            paymentMethod: paymentMethod,
            paymentStatus: paymentStatus,
            subtotal,
            tax,
            total,
            orderTime: orderTime,
            status: 'ordered',
            deliveryTime: null,
            estimatedDelivery: null,
            paymentTime: null,
            shippingTime: null,
            transactionId: null,
            confirmationTime: null,
        });

        newOrder
            .save()
            .then((data) => {
                res.status(201).send(data);
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send('Saving the order was not successful.');
            });
    });
    //#endregion

    return router;
};
