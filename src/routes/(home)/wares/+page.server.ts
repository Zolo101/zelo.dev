import PocketBase from "pocketbase";
import { getCommits, getNews, getWares } from "$lib/fetchDB";

export const load: PageLoad = async () => {
    const pb = new PocketBase("https://cdn.zelo.dev");
    return {wares: await getWares(pb, false)}
};
