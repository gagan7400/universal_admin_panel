let express = require("express");
let { createProductController, getAllProducts, getProductDetails, deleteProduct ,updateProduct } = require("../controllers/productController.js")
let router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.post("/new", isAuthenticatedUser, authorizeRoles("admin"), createProductController)
router.get("/all", getAllProducts)
router.get("/:id", getProductDetails)
router.delete("/:id", isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);
router.put("/:id", isAuthenticatedUser, authorizeRoles("admin"), updateProduct);
module.exports = router; 
