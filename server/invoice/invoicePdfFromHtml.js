const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

/** Single browser instance per Node process (avoid duplicate launches under load). */
let browserInstance = null;
let browserLaunchPromise = null;

/**
 * Puppeteer 24+ can use a Chrome binary under ~/.cache/puppeteer — on Linux that binary
 * still needs dozens of system .so libraries. Distro "chromium" pulls those in via apt.
 *
 * On Linux we only use the Puppeteer cache if USE_PUPPETEER_CACHED_CHROME=1 (then install
 * deps from https://pptr.dev/troubleshooting#chrome-doesnt-launch-on-linux ).
 *
 * Otherwise: set PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium after:
 *   sudo apt-get update && sudo apt-get install -y chromium fonts-liberation
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
            "/usr/bin/chromium",
            "/usr/bin/chromium-browser",
            "/snap/bin/chromium",
            "/usr/lib/chromium-browser/chromium-browser",
            "/usr/lib/chromium/chromium",
            "/usr/lib64/chromium-browser/chromium-browser",
            "/opt/google/chrome/chrome",
        ];
        for (const p of candidates) {
            if (fs.existsSync(p)) return p;
        }

        const allowCached =
            process.env.USE_PUPPETEER_CACHED_CHROME === "1" ||
            process.env.USE_PUPPETEER_CACHED_CHROME === "true";
        if (allowCached) {
            try {
                const cached = puppeteer.executablePath();
                if (cached && fs.existsSync(cached)) return cached;
            } catch {
                /* ignore */
            }
        }

        return null;
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
        " Run on the server (Ubuntu/Debian): sudo apt-get update && sudo apt-get install -y chromium fonts-liberation " +
        "then set in .env: PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium (verify with: which chromium). " +
        "We skip Puppeteer's ~/.cache/puppeteer Chrome on Linux unless USE_PUPPETEER_CACHED_CHROME=1. " +
        "Nginx: increase proxy_read_timeout for /api/order (60–120s)."
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
            const pathStr = opts.executablePath || "";
            const looksLikePuppeteerCache =
                pathStr.includes("puppeteer") || pathStr.includes(".cache/puppeteer");
            let extra = "";
            if (process.platform === "linux") {
                if (msg.includes("shared libraries") || msg.includes("Code: 127")) {
                    extra =
                        " Install distro Chromium (pulls in libs): sudo apt-get install -y chromium fonts-liberation && export PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium ";
                }
                if (looksLikePuppeteerCache && !process.env.USE_PUPPETEER_CACHED_CHROME) {
                    extra +=
                        " Avoid ~/.cache/puppeteer Chrome on Linux without full deps; use system chromium as above. ";
                }
            }
            throw new Error(
                `Puppeteer failed to start Chromium (${pathStr}): ${msg}.${extra}${linuxChromiumHint()}`
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
