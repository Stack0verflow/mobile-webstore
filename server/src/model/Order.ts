import mongoose, { Document, Model, Schema } from 'mongoose';
import { randomBytes } from 'crypto';

interface IAddress {
    firstName: string;
    lastName: string;
    country: string;
    city: string;
    zip: string;
    street: string;
    houseNumber: string;
    isPO?: boolean;
}

interface IContact {
    email: string;
    phone: string;
}

interface IOrder extends Document {
    uuid: string | null;
    user: string;
    contact: IContact;
    products: string[];
    shippingAddress: IAddress;
    shippingMethod: string;
    shippingCost: number;
    billingAddress: Omit<IAddress, 'isPO'>;
    paymentMethod: string;
    paymentStatus: string;
    subtotal: number;
    tax: number;
    total: number;
    orderTime: Date;
    status: string;
    deliveryTime: Date | null;
    estimatedDelivery: Date | null;
    paymentTime: Date | null;
    shippingTime: Date | null;
    transactionId: string;
    confirmationTime: Date | null;
}

const addressSchema: Schema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: true },
    street: { type: String, required: true },
    houseNumber: { type: String, required: true },
    isPO: { type: Boolean, required: false },
});

const contactSchema: Schema = new Schema({
    email: { type: String, required: true },
    phone: { type: String, required: true },
});

const orderSchema: Schema = new Schema(
    {
        uuid: { type: String, required: false, default: null },
        user: { type: String, required: true },
        contact: { type: contactSchema, required: true },
        products: [{ type: String, required: true }],
        shippingAddress: { type: addressSchema, required: true },
        shippingMethod: { type: String, required: true },
        shippingCost: { type: Number, required: true },
        billingAddress: {
            type: new Schema({
                firstName: { type: String, required: true },
                lastName: { type: String, required: true },
                country: { type: String, required: true },
                city: { type: String, required: true },
                zip: { type: String, required: true },
                street: { type: String, required: true },
                houseNumber: { type: String, required: true },
            }),
            required: true,
        },
        paymentMethod: { type: String, required: true },
        paymentStatus: { type: String, required: true },
        subtotal: { type: Number, required: true },
        tax: { type: Number, required: true },
        total: { type: Number, required: true },
        orderTime: { type: Date, required: true },
        status: { type: String, required: true },
        deliveryTime: { type: Date },
        estimatedDelivery: { type: Date },
        paymentTime: { type: Date },
        shippingTime: { type: Date },
        transactionId: { type: String, required: true },
        confirmationTime: { type: Date },
    },
    { collection: 'Order' }
);

// hook (before saving)
orderSchema.pre<IOrder>('save', function () {
    const order = this;

    // generate uuid
    if (!order.uuid) {
        order.uuid = randomBytes(16).toString('hex');
    }
});

export const Order: Model<IOrder> = mongoose.model<IOrder>(
    'Order',
    orderSchema
);
