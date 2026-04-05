const fs = require("fs");
const path = require("path");
const Order = require("../models/orderModel");
const { buildInvoiceNumber } = require("./invoiceGenerator");
const { generateInvoiceHtml } = require("./invoiceHtmlGenerator");
const { htmlStringToPdfBuffer } = require("./invoicePdfFromHtml");

/** Outside `uploads/` so invoices are not exposed by express.static("/uploads") */
const INVOICES_DIR = path.join(__dirname, "..", "storage", "invoices");

function ensureInvoicesDir() {
    if (!fs.existsSync(INVOICES_DIR)) {
        fs.mkdirSync(INVOICES_DIR, { recursive: true });
    }
}

function invoiceFilePath(orderId) {
    return path.join(INVOICES_DIR, `${orderId}.pdf`);
}

function invoiceHtmlFilePath(orderId) {
    return path.join(INVOICES_DIR, `${orderId}.html`);
}

function getInvoiceHtmlStringForOrder(order) {
    const id = order._id.toString();
    const htmlPath = invoiceHtmlFilePath(id);
    if (fs.existsSync(htmlPath)) {
        return fs.readFileSync(htmlPath, "utf8");
    }
    return generateInvoiceHtml(order);
}

/**
 * HTML template → Puppeteer PDF; save .html + .pdf; persist invoiceNumber.
 */
async function createAndSaveInvoiceForOrder(orderDoc) {
    const id = orderDoc._id?.toString();
    if (!id) throw new Error("Order must be saved before creating invoice");

    const invoiceNumber = orderDoc.invoiceNumber || buildInvoiceNumber(orderDoc);
    const forRender = orderDoc.toObject ? orderDoc.toObject() : { ...orderDoc };
    forRender.invoiceNumber = invoiceNumber;

    const htmlString = generateInvoiceHtml(forRender);
    const pdfBuffer = await htmlStringToPdfBuffer(htmlString);

    ensureInvoicesDir();
    fs.writeFileSync(invoiceHtmlFilePath(id), htmlString, "utf8");
    fs.writeFileSync(invoiceFilePath(id), pdfBuffer);

    await Order.findByIdAndUpdate(id, {
        $set: { invoiceNumber, invoiceGeneratedAt: new Date() },
    });

    return { invoiceNumber, pdfBuffer, htmlString };
}

/**
 * Cached PDF on disk, or rebuild from stored/generated HTML via Puppeteer.
 */
async function getInvoicePdfBufferForOrder(order) {
    const id = order._id.toString();
    const pdfPath = invoiceFilePath(id);
    if (fs.existsSync(pdfPath)) {
        return {
            buffer: fs.readFileSync(pdfPath),
            filename: `${order.invoiceNumber || id}.pdf`,
        };
    }

    const html = getInvoiceHtmlStringForOrder(order);
    const buf = await htmlStringToPdfBuffer(html);
    try {
        ensureInvoicesDir();
        fs.writeFileSync(invoiceHtmlFilePath(id), html, "utf8");
        fs.writeFileSync(pdfPath, buf);
    } catch (e) {
        console.error("Invoice cache write failed:", e.message);
    }
    return {
        buffer: buf,
        filename: `${order.invoiceNumber || buildInvoiceNumber(order)}.pdf`,
    };
}

module.exports = {
    createAndSaveInvoiceForOrder,
    getInvoicePdfBufferForOrder,
    invoiceFilePath,
    invoiceHtmlFilePath,
    INVOICES_DIR,
};
