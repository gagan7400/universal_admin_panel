const fs = require("fs");
const path = require("path");
const { normalizePayload } = require("./invoiceGenerator");

const TEMPLATE_PATH = path.join(__dirname, "templates", "invoice.html");

function escapeHtml(text) {
    if (text == null || text === "") return "";
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

/**
 * Renders invoice.html with order data (same fields as PDF).
 */
function generateInvoiceHtml(order) {
    const data = normalizePayload(order);
    const template = fs.readFileSync(TEMPLATE_PATH, "utf8");

    const itemRows = data.lines
        .map(
            (line) => `<tr>
      <td>${escapeHtml(line.name)}</td>
      <td class="num">${line.quantity}</td>
      <td class="num">${line.unitPrice.toFixed(2)}</td>
      <td class="num">${line.lineTotal.toFixed(2)}</td>
    </tr>`
        )
        .join("\n");

    const billToLines = [
        data.billTo.name,
        data.billTo.email,
        data.billTo.phone ? `Phone: ${data.billTo.phone}` : "",
        data.billTo.address,
    ]
        .filter(Boolean)
        .map(escapeHtml)
        .join("<br/>");

    const businessName = escapeHtml(process.env.INVOICE_BUSINESS_NAME || "Your Store");
    const businessAddress = escapeHtml(process.env.INVOICE_BUSINESS_ADDRESS || "");
    const businessGst = process.env.INVOICE_BUSINESS_GST
        ? `GST: ${escapeHtml(process.env.INVOICE_BUSINESS_GST)}`
        : "";

    return template
        .replace(/\{\{INVOICE_NO\}\}/g, escapeHtml(data.invoiceNo))
        .replace(/\{\{ISSUED_AT\}\}/g, escapeHtml(data.issuedAt.toLocaleString()))
        .replace(/\{\{BUSINESS_NAME\}\}/g, businessName)
        .replace(/\{\{BUSINESS_ADDRESS\}\}/g, businessAddress)
        .replace(/\{\{BUSINESS_GST\}\}/g, businessGst)
        .replace(/\{\{BILL_TO\}\}/g, billToLines)
        .replace(/\{\{ITEM_ROWS\}\}/g, itemRows)
        .replace(/\{\{ITEMS_PRICE\}\}/g, data.itemsPrice.toFixed(2))
        .replace(/\{\{TAX_PRICE\}\}/g, data.taxPrice.toFixed(2))
        .replace(/\{\{SHIPPING_PRICE\}\}/g, data.shippingPrice.toFixed(2))
        .replace(/\{\{TOTAL_PRICE\}\}/g, data.totalPrice.toFixed(2))
        .replace(/\{\{PAYMENT_ID\}\}/g, escapeHtml(data.payment.id || "—"))
        .replace(/\{\{PAYMENT_STATUS\}\}/g, escapeHtml(data.payment.status));
}

module.exports = { generateInvoiceHtml, escapeHtml };
