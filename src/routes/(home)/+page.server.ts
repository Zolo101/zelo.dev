import PocketBase from "pocketbase";
import { getCommits, getNews, getWares } from "$lib/fetchDB";

export const load: PageLoad = async () => {
    const pb = new PocketBase("https://cdn.zelo.dev");

    const [wares, news, commits] = await Promise.all([getWares(pb, true), getNews(pb), getCommits(pb)]);
    return {wares, news, commits}
};
