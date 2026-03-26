import type { PageServerLoad } from "./$types";

export const load = (async ({ locals: { db } }) => {
    const wallpapers = await db.collection("backgrounds").getFullList({
        sort: "-date"
    });
    return { wallpapers };
}) satisfies PageServerLoad;
