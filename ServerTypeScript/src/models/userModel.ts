import mongoose, { Document, Schema } from 'mongoose'

interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    userImage: string | null;
    likedRecipes: string[];
    createdAt: Date;
}

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    userImage: {
        type: String,
        trim: true,
        default: null
    },
    likedRecipes: {
        type: [String],
        required: true,
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

export default mongoose.model<IUser>('User', userSchema);
