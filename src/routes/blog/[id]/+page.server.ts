import type { PageServerLoad } from "./$types";
import { getNewsArticle } from "$lib/fetchDB";
import { error } from "@sveltejs/kit";
import { ClientResponseError } from "pocketbase";

export const load: PageServerLoad = async ({ params, locals: { db } }) => {
    try {
        const article = await getNewsArticle(db, params.id);
        return { article };
    } catch (err) {
        if (err instanceof ClientResponseError) {
            if (err.status === 404) {
                throw error(404, "Article not found");
            }
        }
    }
};
