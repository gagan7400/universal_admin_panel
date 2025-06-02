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

const upload = multer({ storage });

module.exports = upload;
