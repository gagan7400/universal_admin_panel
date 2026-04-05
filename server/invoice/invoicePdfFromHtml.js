const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

/** Single browser instance per Node process (avoid duplicate launches under load). */
let browserInstance = null;
let browserLaunchPromise = null;

/**
 * Puppeteer 24+ does not ship Chrome in node_modules by default.
 * Resolution order: PUPPETEER_EXECUTABLE_PATH / CHROME_PATH → OS-specific paths → Puppeteer cache.
 *
 * Linux VPS: install Chromium and point env at it, e.g.
 *   sudo apt-get update && sudo apt-get install -y chromium-browser fonts-liberation
 *   export PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
 * (path may be /usr/bin/chromium-browser — run: which chromium || which chromium-browser)
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
        const candidates = [
            "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            "/Applications/Chromium.app/Contents/MacOS/Chromium",
        ];
        for (const p of candidates) {
            if (fs.existsSync(p)) return p;
        }
    }

    if (process.platform === "linux") {
        const candidates = [
            "/usr/bin/google-chrome-stable",
            "/usr/bin/google-chrome",
            "/usr/bin/chromium-browser",
            "/usr/bin/chromium",
            "/snap/bin/chromium",
            "/usr/lib/chromium-browser/chromium-browser",
            "/usr/lib/chromium/chromium",
            "/usr/lib64/chromium-browser/chromium-browser",
            "/opt/google/chrome/chrome",
        ];
        for (const p of candidates) {
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

function launchArgs() {
    const base = [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--no-first-run",
        "--disable-extensions",
        "--disable-background-networking",
        "--disable-default-apps",
        "--disable-sync",
        "--metrics-recording-only",
        "--mute-audio",
        "--hide-scrollbars",
    ];
    if (process.platform === "linux") {
        base.push(
            "--no-zygote",
            "--disable-software-rasterizer",
            "--disable-features=IsolateOrigins,site-per-process"
        );
    }
    return base;
}

function buildLaunchOptions() {
    const executablePath = resolveChromeExecutable();
    const opts = {
        headless: true,
        args: launchArgs(),
    };
    if (executablePath) {
        opts.executablePath = executablePath;
    }
    return opts;
}

function linuxChromiumHint() {
    if (process.platform !== "linux") return "";
    return (
        " On the server: sudo apt-get update && sudo apt-get install -y chromium-browser fonts-liberation " +
        "(or chromium), then set PUPPETEER_EXECUTABLE_PATH to the output of `which chromium` or `which chromium-browser`. " +
        "If you use Nginx, increase proxy_read_timeout for /api/order (PDF generation can take 30s+ on small VPS)."
    );
}

async function getBrowser() {
    if (browserInstance) {
        try {
            if (browserInstance.connected !== false) return browserInstance;
        } catch {
            browserInstance = null;
        }
    }

    if (browserLaunchPromise) {
        return browserLaunchPromise;
    }

    browserLaunchPromise = (async () => {
        const opts = buildLaunchOptions();
        if (!opts.executablePath) {
            throw new Error(
                "No Chrome/Chromium found for invoice PDFs." +
                    linuxChromiumHint() +
                    " Or set PUPPETEER_EXECUTABLE_PATH to the full path to chrome/chromium."
            );
        }

        try {
            browserInstance = await puppeteer.launch(opts);
            return browserInstance;
        } catch (err) {
            browserInstance = null;
            const msg = err?.message || String(err);
            const extra =
                process.platform === "linux" && msg.includes("shared libraries")
                    ? " Missing system libraries — on Ubuntu try: apt-get install -y libnss3 libatk1.0-0 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2"
                    : "";
            throw new Error(
                `Puppeteer failed to start Chromium (${opts.executablePath}): ${msg}.${extra}${linuxChromiumHint()}`
            );
        } finally {
            browserLaunchPromise = null;
        }
    })();

    return browserLaunchPromise;
}

const PDF_TIMEOUT_MS = Math.min(
    Math.max(Number(process.env.INVOICE_PDF_TIMEOUT_MS) || 120_000, 15_000),
    300_000
);

let loggedChromiumPath = false;

/**
 * Renders full HTML document string to PDF (same visual as template in browser print).
 */
async function htmlStringToPdfBuffer(html) {
    if (!loggedChromiumPath) {
        loggedChromiumPath = true;
        const p = resolveChromeExecutable();
        console.log(
            "[Invoice PDF] Chromium:",
            p || "(not found — set PUPPETEER_EXECUTABLE_PATH or install chromium on the server)"
        );
    }

    const browser = await getBrowser();
    const page = await browser.newPage();
    try {
        await page.setContent(html, { waitUntil: "load", timeout: PDF_TIMEOUT_MS });
        const uint8 = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: { top: "12mm", right: "12mm", bottom: "12mm", left: "12mm" },
        });
        return Buffer.from(uint8);
    } finally {
        await page.close().catch(() => {});
    }
}

async function closeBrowser() {
    browserLaunchPromise = null;
    if (browserInstance) {
        await browserInstance.close().catch(() => {});
        browserInstance = null;
    }
}

process.once("SIGINT", closeBrowser);
process.once("SIGTERM", closeBrowser);

module.exports = { htmlStringToPdfBuffer, closeBrowser, resolveChromeExecutable };
