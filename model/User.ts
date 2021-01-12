import mongoose, { Document } from "mongoose";

export interface UserType extends Document {
    _id?: string;
    avatarUrl: string;
    repos: string;
    followers: string;
    followings: string;
    bio: string;
    name: string;
    email: string;
    url: string;
    userId: string;
    jwtToken?: string;
}

const UserSchema = new mongoose.Schema({
    _id: String,
    avatarUrl: String,
    repos: String,
    followers: String,
    followings: String,
    bio: String,
    name: String,
    email: String,
    url: String,
    userId: String,
    jwtToken: String,
});

const model = mongoose.model<UserType>("User", UserSchema);

export default model;
