/**
 * Shared invoice data for HTML template and HTML→PDF rendering.
 * (PDF is produced by Puppeteer from generateInvoiceHtml output.)
 */

function buildInvoiceNumber(order) {
    const date = order.paidAt ? new Date(order.paidAt) : new Date();
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const idPart = String(order._id || order.id || "order").slice(-8);
    return `INV-${y}${m}${d}-${idPart}`;
}

function normalizePayload(order) {
    const plain = order.toObject ? order.toObject({ getters: true }) : { ...order };
    const shipping = plain.shippingInfo || {};
    const user = plain.user || {};

    const lines = (plain.orderItems || []).map((item) => ({
        name: String(item.name || "Item"),
        quantity: Number(item.quantity) || 0,
        unitPrice: Number(item.price) || 0,
        lineTotal: (Number(item.price) || 0) * (Number(item.quantity) || 0),
    }));

    const shipAddr = [
        shipping.address,
        [shipping.city, shipping.state].filter(Boolean).join(", "),
        [shipping.country, shipping.pinCode != null ? String(shipping.pinCode) : ""]
            .filter(Boolean)
            .join(" "),
    ]
        .filter(Boolean)
        .join("\n");

    return {
        invoiceNo: plain.invoiceNumber || buildInvoiceNumber(plain),
        issuedAt: plain.paidAt ? new Date(plain.paidAt) : new Date(),
        billTo: {
            name: user.name || "Customer",
            email: user.email || "",
            phone: user.phone != null ? String(user.phone) : "",
            address: shipAddr,
        },
        lines,
        itemsPrice: Number(plain.itemsPrice) || 0,
        taxPrice: Number(plain.taxPrice) || 0,
        shippingPrice: Number(plain.shippingPrice) || 0,
        totalPrice: Number(plain.totalPrice) || 0,
        payment: {
            id: plain.paymentInfo?.id || plain.razorpay_payment_id || "",
            status: plain.paymentInfo?.status || "Paid",
        },
    };
}

module.exports = {
    buildInvoiceNumber,
    normalizePayload,
};
