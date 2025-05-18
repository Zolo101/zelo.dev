import { getWares } from "$lib/fetchDB";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals: { db } }) => {
    return { wares: await getWares(db, false) };
};
