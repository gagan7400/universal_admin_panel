const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

let browserPromise;

/**
 * Puppeteer 24+ does not ship Chrome in node_modules by default.
 * Order: env → Windows/macOS/Linux system Chrome or Edge → Puppeteer-managed cache.
 */
function resolveChromeExecutable() {
    const fromEnv =
        process.env.PUPPETEER_EXECUTABLE_PATH || process.env.CHROME_PATH || "";
    if (fromEnv && fs.existsSync(fromEnv)) {
        return fromEnv;
    }

    if (process.platform === "win32") {
        const candidates = [
            path.join(process.env.PROGRAMFILES || "", "Google", "Chrome", "Application", "chrome.exe"),
            path.join(process.env["PROGRAMFILES(X86)"] || "", "Google", "Chrome", "Application", "chrome.exe"),
            path.join(process.env.LOCALAPPDATA || "", "Google", "Chrome", "Application", "chrome.exe"),
            "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
            "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
            path.join(process.env.PROGRAMFILES || "", "Microsoft", "Edge", "Application", "msedge.exe"),
            "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
        ];
        for (const p of candidates) {
            if (p && fs.existsSync(p)) return p;
        }
    }

    if (process.platform === "darwin") {
        const p = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
        if (fs.existsSync(p)) return p;
    }

    if (process.platform === "linux") {
        for (const p of [
            "/usr/bin/google-chrome-stable",
            "/usr/bin/google-chrome",
            "/usr/bin/chromium-browser",
            "/usr/bin/chromium",
        ]) {
            if (fs.existsSync(p)) return p;
        }
    }

    try {
        const cached = puppeteer.executablePath();
        if (cached && fs.existsSync(cached)) return cached;
    } catch {
        /* no managed browser downloaded */
    }

    return null;
}

function launchOptions() {
    const opts = {
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
        ],
    };
    const executablePath = resolveChromeExecutable();
    if (executablePath) {
        opts.executablePath = executablePath;
    }
    return opts;
}

async function getBrowser() {
    if (!browserPromise) {
        const opts = launchOptions();
        if (!opts.executablePath) {
            throw new Error(
                "No Chrome/Chromium found for invoice PDFs. Install Google Chrome or Edge, " +
                    "or set PUPPETEER_EXECUTABLE_PATH to your browser executable, " +
                    "or run: cd server && npx puppeteer browsers install chrome"
            );
        }
        browserPromise = puppeteer.launch(opts);
    }
    return browserPromise;
}

/**
 * Renders full HTML document string to PDF (same visual as template in browser print).
 */
async function htmlStringToPdfBuffer(html) {
    const browser = await getBrowser();
    const page = await browser.newPage();
    try {
        await page.setContent(html, { waitUntil: "load", timeout: 45_000 });
        const uint8 = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: { top: "12mm", right: "12mm", bottom: "12mm", left: "12mm" },
        });
        return Buffer.from(uint8);
    } finally {
        await page.close();
    }
}

async function closeBrowser() {
    if (browserPromise) {
        const b = await browserPromise.catch(() => null);
        browserPromise = null;
        if (b) await b.close().catch(() => {});
    }
}

process.once("SIGINT", closeBrowser);
process.once("SIGTERM", closeBrowser);

module.exports = { htmlStringToPdfBuffer, closeBrowser };
