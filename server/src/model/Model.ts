import mongoose, { Document, Model, Schema } from 'mongoose';
import { randomBytes } from 'crypto';

interface IModel extends Document {
    uuid: string | null;
    name: string;
    colors: string[];
    pictures: string[];
    brand: string;
    details: {
        cpu: {
            speed: number;
            cores: number;
        };
        display: {
            diameter: number;
            resolution: string;
            technology: string;
            refreshRate: number;
            colorDepth: string;
        };
        camera: {
            backResolution: string;
            backMaxZoom: number;
            frontResolution: string;
            autofocus: boolean;
            flashlight: boolean;
            recordingMaxResolution: string;
        };
        memory: {
            ram: number;
            storages: number[];
        };
        network: {
            simType: string;
            dualSim: boolean;
            '5g': boolean;
        };
        connection: {
            usb: string;
            jack: boolean;
            wifi: string;
            bluetooth: string;
            nfc: boolean;
        };
        physical: {
            height: number;
            width: number;
            depth: number;
            weight: number;
        };
        battery: number;
        os: string;
    };
    basePrice: number;
}

const modelSchema: Schema<IModel> = new mongoose.Schema(
    {
        uuid: { type: String, required: false, default: null },
        name: { type: String, required: true },
        colors: { type: [String], required: true },
        pictures: { type: [String], required: true },
        brand: { type: String, required: true },
        details: {
            cpu: {
                speed: { type: Number, required: true },
                cores: { type: Number, required: true },
            },
            display: {
                diameter: { type: Number, required: true },
                resolution: { type: String, required: true },
                technology: { type: String, required: true },
                refreshRate: { type: Number, required: true },
                colorDepth: { type: String, required: true },
            },
            camera: {
                backResolution: { type: String, required: true },
                backMaxZoom: { type: Number, required: true },
                frontResolution: { type: String, required: true },
                autofocus: { type: Boolean, required: true },
                flashlight: { type: Boolean, required: true },
                recordingMaxResolution: { type: String, required: true },
            },
            memory: {
                ram: { type: Number, required: true },
                storages: { type: [Number], required: true },
            },
            network: {
                simType: { type: String, required: true },
                dualSim: { type: Boolean, required: true },
                '5g': { type: Boolean, required: true },
            },
            connection: {
                usb: { type: String, required: true },
                jack: { type: Boolean, required: true },
                wifi: { type: String, required: true },
                bluetooth: { type: String, required: true },
                nfc: { type: Boolean, required: true },
            },
            physical: {
                height: { type: Number, required: true },
                width: { type: Number, required: true },
                depth: { type: Number, required: true },
                weight: { type: Number, required: true },
            },
            battery: { type: Number, required: true },
            os: { type: String, required: true },
        },
        basePrice: { type: Number, required: true },
    },
    { collection: 'Model' }
);

// hook (before saving)
modelSchema.pre<IModel>('save', function () {
    const model = this;

    // generate uuid
    if (!model.uuid) {
        model.uuid = randomBytes(16).toString('hex');
    }
});

export const Model_: Model<IModel> = mongoose.model<IModel>(
    'Model',
    modelSchema
);
