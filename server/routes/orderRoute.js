const express = require("express");
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder, totalOrders } = require("../controllers/orderController");
const router = express.Router();

const { isAuthenticatedUser, authorizeRoles, isAuthenticatedAdmin } = require("../middlewares/auth");

router.route("/new").post(isAuthenticatedUser, newOrder);

router.route("/:id").get(isAuthenticatedUser, getSingleOrder);

router.route("/orders/me").get(isAuthenticatedUser, myOrders);

router.route("/admin/orders").get(isAuthenticatedAdmin, authorizeRoles("admin"), getAllOrders);

router.route("/admin/order/:id").put(isAuthenticatedAdmin, authorizeRoles("admin"), updateOrder).delete(isAuthenticatedAdmin, authorizeRoles("admin"), deleteOrder);

router.route("/admin/total-orders").get(isAuthenticatedAdmin, authorizeRoles("admin"), totalOrders);

module.exports = router;
