const express = require("express");
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder, totalOrders } = require("../controllers/orderController");
const router = express.Router();

// const { isSubadmin, checkSubadminPermission } = require("../middlewares/subadminAuth");
// const { processOrder } = require("../controllers/orderController");

const { isAuthenticatedUser, isAuthenticatedAdmin, checkPermission } = require("../middlewares/auth");

router.route("/new").post(isAuthenticatedUser, newOrder);

router.route("/:id").get(isAuthenticatedUser, getSingleOrder);

router.route("/orders/me").get(isAuthenticatedUser, myOrders);

router.route("/admin/orders").get(isAuthenticatedAdmin, checkPermission('orders'), getAllOrders);

router.route("/admin/order/:id").put(isAuthenticatedAdmin, checkPermission('orders'), updateOrder).delete(isAuthenticatedAdmin, deleteOrder);

router.route("/admin/count-orders").get(isAuthenticatedAdmin, totalOrders);

// subadmin route
// router.put("/:id/process", isSubadmin, checkPermission('products'), updateOrder);

module.exports = router;
