const express = require("express");
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder, totalOrders } = require("../controllers/orderController");
const router = express.Router();

// const { isSubadmin, checkSubadminPermission } = require("../middlewares/subadminAuth");
// const { processOrder } = require("../controllers/orderController");

const { isAuthenticatedUser, isAuthenticatedAdmin, checkPermission, authorizeRoles } = require("../middlewares/auth");

router.route("/new").post(isAuthenticatedUser, newOrder);

router.route("/:id").get(isAuthenticatedUser, getSingleOrder);

router.route("/orders/me").get(isAuthenticatedUser, myOrders);

router.route("/admin/orders").get(isAuthenticatedAdmin, checkPermission('orders'), getAllOrders);

router.route("/admin/order/:id").put(isAuthenticatedAdmin, checkPermission('orders'), updateOrder).delete(isAuthenticatedAdmin, authorizeRoles('admin'), deleteOrder);

router.route("/admin/count-orders").get(isAuthenticatedAdmin, totalOrders);


module.exports = router;
