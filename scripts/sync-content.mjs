import { createHash } from "node:crypto";
import { mkdir, rename, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import PocketBase from "pocketbase";
import { loadEnv } from "vite";

const root = fileURLToPath(new URL("../", import.meta.url));
const env = { ...loadEnv("production", root, ""), ...process.env };
const origin = new URL(env.POCKETBASE_URL || "https://cdn.zelo.dev").origin;
const pb = new PocketBase(origin);
const generated = join(root, ".generated");
const staging = join(generated, "pocketbase");
const destination = join(root, "static/media/pocketbase");
const downloads = new Map();

// Preserve filenames/extensions; give thumbnail variants their own static files.
function localPath(url) {
    const parts = url.pathname.slice("/api/files/".length).split("/").map(decodeURIComponent);
    if (
        parts.length !== 3 ||
        parts.some((part) => !part || /[\\/]/.test(part) || part === "." || part === "..")
    ) {
        throw new Error(`Invalid PocketBase file path: ${url.pathname}`);
    }
    const variant = url.search
        ? createHash("sha256").update(url.search).digest("hex").slice(0, 16) + "-"
        : "";
    parts[2] = variant + parts[2];
    return (url.searchParams.has("thumb") ? "thumbnails/" : "") + parts.join("/");
}

function queueFile(input) {
    const url = new URL(input, origin);
    // Tokens are temporary authorization, not part of a file's identity.
    url.searchParams.delete("token");
    const relative = localPath(url);
    downloads.set(relative, url.href);
    return `/media/pocketbase/${relative.split("/").map(encodeURIComponent).join("/")}`;
}

// Rich text can contain PocketBase images and links, including thumbnail URLs.
function localize(value) {
    if (typeof value === "string") {
        return value.replace(/(?:https?:\/\/[^\s"'<>]+)?\/api\/files\/[^\s"'<>)]+/g, (match) => {
            const url = new URL(match.replaceAll("&amp;", "&"), origin);
            if (![origin, "https://cdn.zelo.dev"].includes(url.origin)) return match;
            url.protocol = new URL(origin).protocol;
            url.host = new URL(origin).host;
            return queueFile(url.href);
        });
    }
    if (Array.isArray(value)) return value.map(localize);
    if (value && typeof value === "object") {
        return Object.fromEntries(
            Object.entries(value).map(([key, entry]) => [key, localize(entry)])
        );
    }
    return value;
}

export async function syncContent() {
    await rm(staging, { recursive: true, force: true });
    await mkdir(staging, { recursive: true });
    const collections = {
        wares: { sort: "-updatedDate,-date", files: ["icon"] },
        backgrounds: { sort: "-date", files: ["media"] },
        artifacts: { sort: "-created", files: ["media"] },
        news: { sort: "-created", files: ["header_img"] },
        zeal: { sort: "-created", files: [] }
    };
    const content = {};
    for (const [name, { sort, files }] of Object.entries(collections)) {
        const records = await pb
            .collection(name)
            .getFullList({ sort, signal: AbortSignal.timeout(120_000) });
        content[name] = records.map((record) => {
            const result = localize(record);
            // Treat a bare domain in a ware link as an external HTTPS URL.
            if (name === "wares" && /^[\w-]+(?:\.[\w-]+)+(?:[/?#]|$)/.test(result.link)) {
                result.link = `https://${result.link}`;
            }
            for (const field of files) {
                if (!record[field]) continue;
                const file = (filename) => queueFile(pb.files.getURL(record, filename));
                result[field] = Array.isArray(record[field])
                    ? record[field].map(file)
                    : file(record[field]);
            }
            if (name === "backgrounds" && record.media) {
                result.mediaThumbnail = queueFile(
                    pb.files.getURL(record, record.media, { thumb: "640x360" })
                );
                result.mediaSquareThumbnail = queueFile(
                    pb.files.getURL(record, record.media, { thumb: "256x256" })
                );
            }
            return result;
        });
        console.log(`Fetched ${records.length} ${name} records`);
    }

    const pending = [...downloads];
    await Promise.all(
        Array.from({ length: 6 }, async () => {
            while (pending.length) {
                const [relative, url] = pending.pop();
                const response = await fetch(url, { signal: AbortSignal.timeout(120_000) });
                if (!response.ok)
                    throw new Error(`Downloading ${relative} failed: HTTP ${response.status}`);
                const path = join(staging, relative);
                await mkdir(dirname(path), { recursive: true });
                await writeFile(path, new Uint8Array(await response.arrayBuffer()));
            }
        })
    );
    // Only replace the previous snapshot after every record and file succeeds.
    await writeFile(join(generated, "content.next.json"), JSON.stringify(content));
    await mkdir(dirname(destination), { recursive: true });
    await rm(destination, { recursive: true, force: true });
    await rename(staging, destination);
    await rename(join(generated, "content.next.json"), join(generated, "content.json"));
    console.log(`Saved static content and ${downloads.size} media files`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    await syncContent();
}
