import { readFileSync } from "node:fs";

interface Content {
    wares: WareItem[];
    backgrounds: WallpaperItem[];
    artifacts: PostItem[];
    news: NewsItem[];
    zeal: ZealItem[];
}

let snapshot: Content | undefined;

export function getContent(): Content {
    if (!snapshot) {
        try {
            snapshot = JSON.parse(readFileSync(".generated/content.json", "utf8")) as Content;
        } catch (cause) {
            throw new Error("Cannot read the content snapshot. Run pnpm sync:content first.", {
                cause
            });
        }
    }
    return snapshot;
}
