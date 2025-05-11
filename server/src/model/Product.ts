import mongoose, { Document, Model, Schema } from 'mongoose';

interface IProduct extends Document {
    serial: string;
    model_: string;
    name: string;
    color: string;
    picture: string;
    storage: number;
    price: number;
    warranty: number;
    quantity: number;
}

const productSchema: Schema<IProduct> = new mongoose.Schema(
    {
        serial: { type: String, required: true, unique: true },
        model_: { type: String, required: true },
        name: { type: String, required: true },
        color: { type: String, required: true },
        picture: { type: String, required: true },
        storage: { type: Number, required: true },
        price: { type: Number, required: true },
        warranty: { type: Number, required: true },
        quantity: { type: Number, required: true },
    },
    { collection: 'Product' }
);

export const Product: Model<IProduct> = mongoose.model<IProduct>(
    'Product',
    productSchema
);
