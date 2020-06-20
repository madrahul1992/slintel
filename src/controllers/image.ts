import { Request, Response } from "express";
import {UserDocument} from "../models/User";
import {Image} from "../models/Image";
import logger from "../util/logger";
import sharp from "sharp";
import fs from "fs";

const imageDir = "images";
if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir);
}

const thumbnailDir = "images/thumbnails";

if (!fs.existsSync(thumbnailDir)) {
    fs.mkdirSync(thumbnailDir);
}

/**
 * POST /upload
 * Upload image.
 */
export const imageUpload = async (req: Request, res: Response) => {
    const user = req.user as UserDocument;
    if (!user) {
        throw new Error("User not found");
    }
    try {
        const filePath = req.protocol + "://" + req.get("host") + "/"+req.file.filename;

        await Image.create({
            user: user._id,
            fileName: req.file.filename,
            filePath
        });

        res.locals.user.image = filePath;

        res.render("home");
    } catch(error) {
        logger.error("Something went wrong:: ", error);
        res.redirect("/");
    }
};

/**
 * POST /thumbnail
 * Generate Thumbnail.
 */
export const generateThumbnail = async (req: Request, res: Response) => {
    const {imagePath, resolution} = req.body;
    try {
        const image = await Image.findOne({
            filePath: imagePath
        });

        if (!image) {
            throw new Error("Image not found");
        }

        const { height, width } = JSON.parse(resolution);

        const thumbnailName = `${image.fileName.split(".")[0]}-${height}*${width}.${image.fileName.split(".")[image.fileName.split(".").length -1]}`;

        const thumbnailPath = req.protocol + "://" + req.get("host") + "/thumbnails/"+thumbnailName;

        if (!image.thumbnails.find(thumbnail => thumbnail.filePath === thumbnailPath)) {
            await sharp(await fs.readFileSync(`images/${image.fileName}`))
                .resize(height, width)
                .toFile(`${thumbnailDir}/${thumbnailName}`);

            await Image.findByIdAndUpdate(image._id, {
                $addToSet: {
                    thumbnails: {
                        filePath: thumbnailPath
                    }
                }
            });
        }

        res.locals.user.image = image.filePath;
        res.locals.user.thumbnail = {
            thumbnailPath,
            height,
            width
        };

        res.render("home");

    } catch(error) {
        logger.error("Something went wrong:: ", error);
        res.redirect("/");
    }
};
