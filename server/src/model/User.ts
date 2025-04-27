import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

const SALT_FACTOR = 10;

interface IUser extends Document {
    uuid: string | null;
    email: string;
    password: string;
    adminToken: string | null;
    comparePassword: (
        candidatePassword: string,
        callback: (error: Error | null, isMatch: boolean) => void
    ) => void;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
    {
        uuid: { type: String, required: false, default: null },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        adminToken: { type: String, required: false, default: null },
    },
    { collection: 'User' }
);

// hook (before saving)
userSchema.pre<IUser>('save', function (next) {
    const user = this;

    // generate uuid
    if (!user.uuid) {
        user.uuid = randomBytes(16).toString('hex');
    }

    // hash password
    bcrypt.genSalt(SALT_FACTOR, (error, salt) => {
        if (error) {
            return next(error);
        }
        bcrypt.hash(user.password, salt, (err, encrypted) => {
            if (err) {
                return next(err);
            }
            user.password = encrypted;
            next();
        });
    });
});

userSchema.methods.comparePassword = function (
    candidatePassword: string,
    callback: (error: Error | null, isMatch: boolean) => void
): void {
    const user = this;
    bcrypt.compare(candidatePassword, user.password, (error, isMatch) => {
        if (error) {
            return callback(error, false);
        }
        callback(null, isMatch);
    });
};

export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
