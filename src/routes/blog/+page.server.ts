import { getContent } from "$lib/server/content";
import type { PageServerLoad } from "./$types";

export const load = (() => ({
    news: getContent().news
})) satisfies PageServerLoad;
