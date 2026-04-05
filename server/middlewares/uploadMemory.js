const multer = require("multer");

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB per file

/**
 * Memory storage → buffers are sent to Cloudinary in controllers.
 * Field names stay the same as with disk upload ("image", "bannerImage", "images", "bannerImages").
 */
const uploadMemory = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_SIZE },
});

module.exports = uploadMemory;
