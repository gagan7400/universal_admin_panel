const { cloudinary, assertConfigured } = require("../config/cloudinary");

const ROOT = (process.env.CLOUDINARY_ROOT_FOLDER || "universal_admin").replace(/^\/+|\/+$/g, "");

function folder(...parts) {
    return [ROOT, ...parts].filter(Boolean).join("/");
}

/**
 * Upload a single image buffer to Cloudinary.
 * @returns {Promise<{ secure_url: string, public_id: string }>}
 */
async function uploadImageBuffer(buffer, mimetype, subFolder) {
    assertConfigured();
    if (!buffer || !buffer.length) {
        throw new Error("Empty image buffer");
    }
    const mime = mimetype || "image/jpeg";
    const dataUri = `data:${mime};base64,${buffer.toString("base64")}`;
    const result = await cloudinary.uploader.upload(dataUri, {
        folder: folder(subFolder),
        resource_type: "image",
        overwrite: false,
    });
    return {
        secure_url: result.secure_url,
        public_id: result.public_id,
    };
}

/** DB shape: url = Cloudinary URL; fileName stores public_id (needed for destroy). */
function toStoredImage(uploadResult) {
    return {
        fileName: uploadResult.public_id,
        url: uploadResult.secure_url,
    };
}

function isCloudinaryUrl(url) {
    return typeof url === "string" && url.includes("res.cloudinary.com");
}

/**
 * Best-effort public_id from a standard delivery URL (for legacy rows that only have url).
 */
function publicIdFromCloudinaryUrl(url) {
    try {
      const u = new URL(url);
      const parts = u.pathname.split("/").filter(Boolean);
      const uploadIdx = parts.indexOf("upload");
      if (uploadIdx === -1) return null;
      let rest = parts.slice(uploadIdx + 1);
      if (rest.length && /^v\d+$/i.test(rest[0])) rest = rest.slice(1);
      const joined = rest.join("/");
      return joined.replace(/\.[^/.]+$/, "") || null;
    } catch {
        return null;
    }
}

async function destroyByPublicId(publicId) {
    if (!publicId) return;
    assertConfigured();
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
}

/**
 * Remove image: Cloudinary (by public_id) or legacy local file under /uploads/.
 */
async function removeStoredImage(img, uploadsDir) {
    const fs = require("fs");
    const path = require("path");
    if (!img?.url) return;

    const storedId = img.fileName || img.filename;

    if (isCloudinaryUrl(img.url)) {
        const pid = storedId || publicIdFromCloudinaryUrl(img.url);
        if (pid) {
            try {
                await destroyByPublicId(pid);
            } catch (e) {
                console.error("Cloudinary destroy failed:", pid, e.message);
            }
        }
        return;
    }

    const rel = img.url.split("/uploads/")[1] || storedId;
    if (rel && uploadsDir) {
        const filePath = path.join(uploadsDir, rel);
        if (fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
            } catch (e) {
                console.error("Local file delete failed:", filePath, e.message);
            }
        }
    }
}

module.exports = {
    uploadImageBuffer,
    toStoredImage,
    isCloudinaryUrl,
    publicIdFromCloudinaryUrl,
    destroyByPublicId,
    removeStoredImage,
    folder,
};
