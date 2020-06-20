import multer from "multer";
import * as path from "path";
import fs from "fs";

const imageDir = "images";
if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
}

const storage = multer.diskStorage({ //multers disk storage settings
    destination: (req, file, cb) => {
        const { id } = req.body;
        return cb(null, imageDir);
    },
    filename: function (req, file, cb) {
        const datetimestamp = Date.now();
        cb(null, file.fieldname + "-" + datetimestamp + "." + file.originalname.split(".")[file.originalname.split(".").length -1]);
    }
});

export const upload = multer({ //multer settings
    storage: storage,
    fileFilter: function (req, file, callback) {
        const ext = path.extname(file.originalname).toLowerCase();
        if(ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
            return callback(new Error("Only images are allowed"));
        }
        callback(null, true);
    },
    limits: {
        files: 1,
        fileSize: 1024 * 1024
    }
}).single("imageupload");