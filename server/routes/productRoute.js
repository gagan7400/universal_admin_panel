let express = require("express");
let { createProductController, getAllProducts, getProductDetails, deleteProduct, updateProduct, } = require("../controllers/productController.js");

let router = express.Router();

const { isAuthenticatedAdmin, authorizeRoles } = require("../middlewares/auth");
let upload = require("../middlewares/upload.js")

// ✅ Route for creating new product with images (multipart/form-data)
router.post("/new", isAuthenticatedAdmin, authorizeRoles("admin"), upload.array("images"), createProductController);

// ✔️ Get all products
router.get("/all", getAllProducts);

// ✔️ Get product by ID
router.get("/:id", getProductDetails);

// ✔️ Delete product (admin only)
router.delete("/:id", isAuthenticatedAdmin, authorizeRoles("admin"), deleteProduct);

// ❗ Update product does not currently support image uploads
// If you want to allow image updates too, add upload middleware here
router.put("/:id", isAuthenticatedAdmin, authorizeRoles("admin"), upload.array("images"), updateProduct);

module.exports = router;
