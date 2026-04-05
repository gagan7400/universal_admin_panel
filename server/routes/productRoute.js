let express = require("express");
let { createProductController, getAllProducts, getProductDetails, deleteProduct, updateProduct, countProduct, addBanners, getBanners, getAllCategories, getProductsByCategory, deleteBannerImage } = require("../controllers/productController.js");
let router = express.Router();
const { isAuthenticatedAdmin, authorizeRoles, checkPermission } = require("../middlewares/auth");
let uploadMemory = require("../middlewares/uploadMemory.js");

//banner image for products
router.get("/bannerimages", getBanners);
router.post("/bannerimages", uploadMemory.fields([{ name: "bannerImages", maxCount: 10 }]), addBanners);
router.delete("/banner/:bannerid", isAuthenticatedAdmin, authorizeRoles("admin"), deleteBannerImage);

router.get("/categories", getAllCategories);
router.get("/category/:category", getProductsByCategory);

router.post("/new", isAuthenticatedAdmin, authorizeRoles('admin'), uploadMemory.fields([{ name: "bannerImage", maxCount: 1 }, { name: "images", maxCount: 10 },]), createProductController);
router.get("/count-products", countProduct);
router.get("/all", getAllProducts);
router.get("/:id", getProductDetails);
router.delete("/:id", isAuthenticatedAdmin, authorizeRoles('admin'), deleteProduct);
router.put("/:id", isAuthenticatedAdmin, authorizeRoles('admin'), uploadMemory.fields([{ name: "bannerImage", maxCount: 1 }, { name: "images", maxCount: 10 },]), updateProduct);


module.exports = router;