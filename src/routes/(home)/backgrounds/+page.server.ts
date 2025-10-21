import type { PageServerLoad } from "./$types";

export const load = (async ({ locals: { db } }) => {
    const backgrounds = await db.collection("backgrounds").getFullList({
        sort: "-date"
    });
    return { backgrounds };
}) satisfies PageServerLoad;
