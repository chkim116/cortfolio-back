import mongoose, { Document } from "mongoose";

export interface UserType extends Document {
    avatarUrl: string;
    repos: string;
    followers: string;
    followings: string;
    bio: string | null;
    name: string;
    email: string;
    url: string;
    userId: string;
    company: string | null;
    blog: string;
    location: string | null;
    jwtToken?: string;
}

const UserSchema = new mongoose.Schema({
    avatarUrl: String,
    repos: String,
    followers: String,
    followings: String,
    bio: String,
    name: String,
    email: String,
    url: String,
    userId: String,
    company: String,
    blog: String,
    location: String,
    jwtToken: String,
});

const model = mongoose.model<UserType>("User", UserSchema);

export default model;
