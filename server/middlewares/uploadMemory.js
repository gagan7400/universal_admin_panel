const multer = require("multer");
const path = require("path");

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB per file

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed! (jpeg, jpg, png, gif, webp, svg)"), false);
    }
};

/**
 * Memory storage → buffers are sent to Cloudinary in controllers.
 * Field names stay the same as with disk upload ("image", "bannerImage", "images", "bannerImages").
 */
const uploadMemory = multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits: { fileSize: MAX_SIZE },
});

module.exports = uploadMemory;
