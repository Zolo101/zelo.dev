import { getBackgrounds } from "$lib/fetchDB";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals: { db } }) => {
    return { backgrounds: await getBackgrounds(db) };
};
