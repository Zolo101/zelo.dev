import PocketBase from "pocketbase";
import type { EntryGenerator, RouteParams } from "./$types";

export const entries: EntryGenerator = async () => {
    const pb = new PocketBase("https://cdn.zelo.dev");
    const newsList = await pb.collection("news").getFullList();
    // return [{ slug: "uhbg6idhwnwua0c" }];
    return newsList.map((news) => ({
        id: news.id,
    }));
};
