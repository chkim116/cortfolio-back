import mongoose, { Document } from "mongoose";

export interface CortfolioType extends Document {
    userId: string;
    avatarUrl: string;
    skills: [{ id: number; name: string; icon: string }];
    project: [
        {
            id: number;
            name: string;
            thumb: string;
            description: string;
            gitLink: string;
            pageLink: string;
        }
    ];
    contact: {
        name: string;
        phone: string;
        email: string;
        career: [
            {
                id: number;
                companyName: string;
                date: string;
                task: string;
            }
        ];
    };
}
const UserSchema = new mongoose.Schema({
    userId: String,
    avatarUrl: String,
    skills: { id: Number, name: String, icon: String },
    project: {
        id: Number,
        name: String,
        thumb: String,
        description: String,
        gitLink: String,
        pageLink: String,
    },
    contact: {
        name: String,
        phone: String,
        email: String,
        career: [
            {
                companyName: String,
                id: Number,
                date: String,
                task: String,
            },
        ],
    },
});

const model = mongoose.model<CortfolioType>("Cortfolio", UserSchema);

export default model;
