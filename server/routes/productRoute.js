let express = require("express");
let { createProductController, getAllProducts, getProductDetails, deleteProduct, updateProduct } = require("../controllers/productController.js")
let router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

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

// router.post(
//     "/new",
//     isAuthenticatedUser,
//     authorizeRoles("admin"),
//     upload.array("images"), // 👈 key name should match the frontend FormData key
//     createProductController
// );

router.post("/new", isAuthenticatedUser, authorizeRoles("admin"), createProductController)
router.get("/all", getAllProducts)
router.get("/:id", getProductDetails)
router.delete("/:id", isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);
router.put("/:id", isAuthenticatedUser, authorizeRoles("admin"), updateProduct);
module.exports = router; 
