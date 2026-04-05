const express = require("express");
const {
    getSingleOrder,
    myOrders,
    getAllOrders,
    updateOrder,
    deleteOrder,
    totalOrders,
    calculatePrice,
    downloadUserOrderInvoice,
    downloadAdminOrderInvoice,
} = require("../controllers/orderController");
const router = express.Router();

const { isAuthenticatedUser, isAuthenticatedAdmin, checkPermission, authorizeRoles } = require("../middlewares/auth");

router.post("/calculate-price", isAuthenticatedUser, calculatePrice);
router.get("/orders/me", isAuthenticatedUser, myOrders);

router.get("/admin/orders", isAuthenticatedAdmin, checkPermission("orders"), getAllOrders);
router.get(
    "/admin/order/:id/invoice",
    isAuthenticatedAdmin,
    checkPermission("orders"),
    downloadAdminOrderInvoice
);
router
    .route("/admin/order/:id")
    .put(isAuthenticatedAdmin, checkPermission("orders"), updateOrder)
    .delete(isAuthenticatedAdmin, authorizeRoles("admin"), deleteOrder);
router.get("/admin/count-orders", isAuthenticatedAdmin, totalOrders);

router.get("/:id/invoice", isAuthenticatedUser, downloadUserOrderInvoice);
router.get("/:id", isAuthenticatedUser, getSingleOrder);

module.exports = router;
