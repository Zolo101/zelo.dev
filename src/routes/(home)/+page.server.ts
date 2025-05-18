import { getCommits, getNews, getWares } from "$lib/fetchDB";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals: { db } }) => {
    const [wares, news, commits] = await Promise.all([
        getWares(db, true),
        getNews(db),
        getCommits(db)
    ]);
    return { wares, news, commits };
};
