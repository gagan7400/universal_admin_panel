let express = require("express");
let { createProductController, getAllProducts, getProductDetails, deleteProduct, updateProduct, countProduct } = require("../controllers/productController.js");
let router = express.Router();
const { isAuthenticatedAdmin, authorizeRoles, checkPermission } = require("../middlewares/auth");
let upload = require("../middlewares/upload.js");

router.post("/new", isAuthenticatedAdmin, checkPermission('products'), upload.fields([{ name: "bannerImage", maxCount: 1 }, { name: "images", maxCount: 10 },]), createProductController);
router.get("/count-products", isAuthenticatedAdmin, countProduct);
router.get("/all", getAllProducts);
router.get("/:id", getProductDetails);
router.delete("/:id", isAuthenticatedAdmin, checkPermission('products'), deleteProduct);
router.put("/:id", isAuthenticatedAdmin, checkPermission('products'), upload.fields([{ name: "bannerImage", maxCount: 1 }, { name: "images", maxCount: 10 },]), updateProduct);

module.exports = router;
