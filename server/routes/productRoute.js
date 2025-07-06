let express = require("express");
let { createProductController, getAllProducts, getProductDetails, deleteProduct, updateProduct, countProduct } = require("../controllers/productController.js");

let router = express.Router();

const { isAuthenticatedAdmin, authorizeRoles } = require("../middlewares/auth");
let upload = require("../middlewares/upload.js")
router.post("/new", isAuthenticatedAdmin, authorizeRoles("admin"), upload.fields([
    { name: "bannerImage", maxCount: 1 },
    { name: "images", maxCount: 10 },
]), createProductController);
router.get("/count-products", isAuthenticatedAdmin, authorizeRoles("admin"), countProduct);

router.get("/all", getAllProducts);
router.get("/:id", getProductDetails);

router.delete("/:id", isAuthenticatedAdmin, authorizeRoles("admin"), deleteProduct);

router.put("/:id", isAuthenticatedAdmin, authorizeRoles("admin"), upload.fields([
    { name: "bannerImage", maxCount: 1 },
    { name: "images", maxCount: 10 },
]), updateProduct);

module.exports = router;
