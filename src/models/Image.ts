import mongoose, {Schema} from "mongoose";

export type ImageDocument = mongoose.Document & {
    user: string;
    fileName: string;
    filePath: string;
    thumbnails?: {
        filePath: string;
    }[];
};

const imageSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    fileName: String,
    filePath: String,
    thumbnails: [{
        filePath: String
    }]
}, { timestamps: true });


export const Image = mongoose.model<ImageDocument>("Image", imageSchema);
