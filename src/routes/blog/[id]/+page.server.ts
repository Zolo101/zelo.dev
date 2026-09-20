import { getContent } from "$lib/server/content";
import { error } from "@sveltejs/kit";
import type { EntryGenerator, PageServerLoad } from "./$types";

export const entries: EntryGenerator = () => getContent().news.map(({ id }) => ({ id }));

export const load = (({ params }) => {
    const article = getContent().news.find(({ id }) => id === params.id);
    if (!article) error(404, "Article not found");
    return { article };
}) satisfies PageServerLoad;
