import PocketBase, { BaseAuthStore } from "pocketbase";

export async function getLiveArtifacts(baseURL: string, signal: AbortSignal): Promise<PostItem[]> {
    const db = new PocketBase(baseURL, new BaseAuthStore());
    const records = await db.collection<PostItem>("artifacts").getFullList({
        sort: "-created",
        signal,
        requestKey: null,
        cache: "no-store"
    });
    return records.map((record) => ({
        ...record,
        media: record.media ? db.files.getURL(record, record.media) : ""
    }));
}

export async function getLiveQuestions(baseURL: string, signal: AbortSignal): Promise<QAItem[]> {
    const db = new PocketBase(baseURL, new BaseAuthStore());
    return db.collection<QAItem>("qa").getFullList({
        sort: "-created",
        signal,
        requestKey: null,
        cache: "no-store"
    });
}
