const multer = require("multer");
const fs = require("fs");
const path = require("path");

const uploadDir = path.join(__dirname, "../uploads");
 
// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const originalName = path.parse(file.originalname).name; // without extension
        const ext = path.extname(file.originalname); // includes the dot, like '.jpg'

        let filename = `${originalName}${ext}`;
        let counter = 1;

        // Check if file already exists
        while (fs.existsSync(path.join(uploadDir, filename))) {
            filename = `${originalName}-${counter}${ext}`;
            counter++;
        }
        cb(null, filename);
    },
});

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

const upload = multer({ 
    storage, 
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

module.exports = upload;
