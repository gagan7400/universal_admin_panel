// invoice/invoiceService.js
const fs = require("fs").promises; // Use promises version
const fsSync = require("fs");      // Fallback only for existsSync if needed, or use access
const path = require("path");
const Order = require("../models/orderModel");
const { buildInvoiceNumber } = require("./invoiceGenerator");
const { generateInvoiceHtml } = require("./invoiceHtmlGenerator");
const { htmlStringToPdfBuffer } = require("./invoicePdfFromHtml");

const INVOICES_DIR = path.join(__dirname, "..", "storage", "invoices");

async function ensureInvoicesDir() {
    try {
        await fs.mkdir(INVOICES_DIR, { recursive: true });
    } catch (err) {
        if (err.code !== 'EEXIST') throw err;
    }
}

function invoiceFilePath(orderId) {
    return path.join(INVOICES_DIR, `${orderId}.pdf`);
}

function invoiceHtmlFilePath(orderId) {
    return path.join(INVOICES_DIR, `${orderId}.html`);
}

async function getInvoiceHtmlStringForOrder(order) {
    const id = order._id.toString();
    const htmlPath = invoiceHtmlFilePath(id);
    try {
        return await fs.readFile(htmlPath, "utf8");
    } catch {
        return generateInvoiceHtml(order);
    }
}

async function createAndSaveInvoiceForOrder(orderDoc) {
    const id = orderDoc._id?.toString();
    if (!id) throw new Error("Order must be saved before creating invoice");

    const invoiceNumber = orderDoc.invoiceNumber || buildInvoiceNumber(orderDoc);
    const forRender = orderDoc.toObject ? orderDoc.toObject() : { ...orderDoc };
    forRender.invoiceNumber = invoiceNumber;

    const htmlString = generateInvoiceHtml(forRender);
    let pdfBuffer;
    try {
        pdfBuffer = await htmlStringToPdfBuffer(htmlString);
    } catch (e) {
        console.error("[Invoice] PDF generation failed:", e.message);
        throw e;
    }

    await ensureInvoicesDir();
    await Promise.all([
        fs.writeFile(invoiceHtmlFilePath(id), htmlString, "utf8"),
        fs.writeFile(invoiceFilePath(id), pdfBuffer)
    ]);

    await Order.findByIdAndUpdate(id, {
        $set: { invoiceNumber, invoiceGeneratedAt: new Date() },
    });

    return { invoiceNumber, pdfBuffer, htmlString };
}

async function getInvoicePdfBufferForOrder(order) {
    const id = order._id.toString();
    const pdfPath = invoiceFilePath(id);
    
    try {
        const buffer = await fs.readFile(pdfPath);
        return {
            buffer,
            filename: `${order.invoiceNumber || id}.pdf`,
        };
    } catch {
        // Build on demand if file does not exist
        const html = await getInvoiceHtmlStringForOrder(order);
        let buf;
        try {
            buf = await htmlStringToPdfBuffer(html);
        } catch (e) {
            console.error("[Invoice] PDF on-demand generation failed:", e.message);
            throw e;
        }
        
        try {
            await ensureInvoicesDir();
            await Promise.all([
                fs.writeFile(invoiceHtmlFilePath(id), html, "utf8"),
                fs.writeFile(pdfPath, buf)
            ]);
        } catch (e) {
            console.error("Invoice cache write failed:", e.message);
        }
        return {
            buffer: buf,
            filename: `${order.invoiceNumber || buildInvoiceNumber(order)}.pdf`,
        };
    }
}

module.exports = {
    createAndSaveInvoiceForOrder,
    getInvoicePdfBufferForOrder,
    invoiceFilePath,
    invoiceHtmlFilePath,
    INVOICES_DIR,
};
