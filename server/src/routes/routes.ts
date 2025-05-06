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
        const { name, colors, pictures, brand, details, basePrice } = req.body;

        if (
            !name ||
            !Array.isArray(colors) ||
            (Array.isArray(colors) && colors.length === 0) ||
            !Array.isArray(pictures) ||
            (Array.isArray(pictures) && pictures.length === 0) ||
            !brand ||
            !details ||
            !basePrice
        ) {
            res.status(400).send('Missing required fields to create model.');
        }

        if (colors.length !== pictures.length) {
            res.status(400).send('Colors and pictures count must match.');
        }

        const newModel = new Model_({
            uuid: null,
            name,
            colors,
            pictures,
            brand,
            details: {
                cpu: {
                    speed: details.cpu.speed,
                    cores: details.cpu.cores,
                },
                display: {
                    diameter: details.display.diameter,
                    resolution: details.display.resolution,
                    technology: details.display.technology,
                    refreshRate: details.display.refreshRate,
                    colorDepth: details.display.colorDepth,
                },
                camera: {
                    backResolution: details.camera.backResolution,
                    backMaxZoom: details.camera.backMaxZoom,
                    frontResolution: details.camera.frontResolution,
                    autofocus: details.camera.autofocus,
                    flashlight: details.camera.flashlight,
                    recordingMaxResolution:
                        details.camera.recordingMaxResolution,
                },
                memory: {
                    ram: details.memory.ram,
                    storages: details.memory.storages,
                },
                network: {
                    simType: details.network.simType,
                    dualSim: details.network.dualSim,
                    '5g': details.network['5g'],
                },
                connection: {
                    usb: details.connection.usb,
                    jack: details.connection.jack,
                    wifi: details.connection.wifi,
                    bluetooth: details.connection.bluetooth,
                    nfc: details.connection.nfc,
                },
                physical: {
                    height: details.physical.height,
                    width: details.physical.width,
                    depth: details.physical.depth,
                    weight: details.physical.weight,
                },
                battery: details.battery,
                os: details.os,
            },
            basePrice,
        });

        newModel
            .save()
            .then((data) => {
                res.status(201).send(data);
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send('Saving the model was not successful.');
            });
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
            color,
            picture,
            storage,
            price,
            arrivalDate,
            warranty,
        } = req.body;

        // Validate required fields
        if (
            !serial ||
            !model ||
            !color ||
            !picture ||
            !storage ||
            !price ||
            !arrivalDate ||
            !warranty
        ) {
            res.status(400).send('Missing required product fields.');
        }

        if (!(arrivalDate instanceof Date)) {
            res.status(400).send('Arrival date must be a valid date.');
        }

        // Create the product
        const newProduct = new Product({
            serial,
            model,
            color,
            picture,
            storage,
            price,
            arrivalDate,
            warranty,
            sellDate: null,
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
