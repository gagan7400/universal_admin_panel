// let express = require("express");
// let { createProductController, getAllProducts, getProductDetails, deleteProduct, updateProduct } = require("../controllers/productController.js")
// let router = express.Router();
// const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

// const multer = require("multer");

// // const storage = multer.memoryStorage(); // or use diskStorage or Cloudinary uploader
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "uploads/"); // Save to /uploads
//     },
//     filename: function (req, file, cb) {
//         cb(null, `${Date.now()}-${file.originalname}`);
//     },
// });
// const upload = multer({ storage });

// router.post("/new", isAuthenticatedUser, authorizeRoles("admin"), upload.array("images"), createProductController);

// // router.post("/new", isAuthenticatedUser, authorizeRoles("admin"), createProductController)
// router.get("/all", getAllProducts)
// router.get("/:id", getProductDetails)
// router.delete("/:id", isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);
// router.put("/:id", isAuthenticatedUser, authorizeRoles("admin"), updateProduct);
// module.exports = router; 


let express = require("express");
let {
    createProductController,
    getAllProducts,
    getProductDetails,
    deleteProduct,
    updateProduct,
} = require("../controllers/productController.js");

let router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");
let upload = require("../middlewares/upload.js")
// const multer = require("multer");

// ✅ Use diskStorage (or memoryStorage/Cloudinary if needed)
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "uploads/"); // ✔️ Files saved to /uploads
//     },
//     filename: function (req, file, cb) {
//         cb(null, `${Date.now()}-${file.originalname}`);
//     },
// });
// const upload = multer({ storage });

// ✅ Route for creating new product with images (multipart/form-data)
router.post("/new", isAuthenticatedUser, authorizeRoles("admin"), upload.array("images"), createProductController);

// ✔️ Get all products
router.get("/all", getAllProducts);

// ✔️ Get product by ID
router.get("/:id", getProductDetails);

// ✔️ Delete product (admin only)
router.delete("/:id", isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

// ❗ Update product does not currently support image uploads
// If you want to allow image updates too, add upload middleware here
router.put("/:id", isAuthenticatedUser, authorizeRoles("admin"), upload.array("images"), updateProduct);

module.exports = router;
