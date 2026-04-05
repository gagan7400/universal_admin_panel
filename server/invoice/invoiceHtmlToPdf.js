const puppeteer = require("puppeteer");

let browserPromise;

/**
 * Reuse one Chromium instance (Puppeteer is heavy to start per invoice).
 */
function getBrowser() {
    if (!browserPromise) {
        browserPromise = puppeteer.launch({
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
            ],
        });
    }
    return browserPromise;
}

/**
 * Render full HTML document string to PDF (same visual as template in browser print).
 */
async function htmlStringToPdfBuffer(html) {
    const browser = await getBrowser();
    const page = await browser.newPage();
    try {
        await page.setContent(html, { waitUntil: "load" });
        const pdfBytes = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {
                top: "12px",
                right: "12px",
                bottom: "12px",
                left: "12px",
            },
        });
        return Buffer.from(pdfBytes);
    } finally {
        await page.close();
    }
}

async function closeInvoiceBrowser() {
    if (browserPromise) {
        const b = await browserPromise.catch(() => null);
        browserPromise = null;
        if (b) await b.close();
    }
}

module.exports = {
    htmlStringToPdfBuffer,
    closeInvoiceBrowser,
};
