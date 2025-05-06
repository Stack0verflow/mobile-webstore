import mongoose, { Document, Model, Schema } from 'mongoose';

interface IProduct extends Document {
    serial: string;
    model_: string;
    color: string;
    picture: string;
    storage: number;
    price: number;
    arrivalDate: Date;
    warranty: number;
    sellDate: Date | null;
}

const productSchema: Schema<IProduct> = new mongoose.Schema(
    {
        serial: { type: String, required: true, unique: true },
        model_: { type: String, required: true },
        color: { type: String, required: true },
        picture: { type: String, required: true },
        storage: { type: Number, required: true },
        price: { type: Number, required: true },
        arrivalDate: { type: Date, required: true },
        warranty: { type: Number, required: true },
        sellDate: { type: Date, required: false, default: null },
    },
    { collection: 'Product' }
);

export const Product: Model<IProduct> = mongoose.model<IProduct>(
    'Product',
    productSchema
);
