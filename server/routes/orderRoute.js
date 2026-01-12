const express = require("express");
const {  getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder, totalOrders, calculatePrice } = require("../controllers/orderController");
const router = express.Router();

const { isAuthenticatedUser, isAuthenticatedAdmin, checkPermission, authorizeRoles } = require("../middlewares/auth");
 
router.route("/:id").get(isAuthenticatedUser, getSingleOrder);

router.route("/orders/me").get(isAuthenticatedUser, myOrders);


router.post("/calculate-price",isAuthenticatedUser, calculatePrice);

router.route("/admin/orders").get(isAuthenticatedAdmin, checkPermission('orders'), getAllOrders);

router.route("/admin/order/:id").put(isAuthenticatedAdmin, checkPermission('orders'), updateOrder).delete(isAuthenticatedAdmin, authorizeRoles('admin'), deleteOrder);

router.route("/admin/count-orders").get(isAuthenticatedAdmin, totalOrders);


module.exports = router;
