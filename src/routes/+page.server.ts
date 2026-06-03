import type { PageServerLoad } from "./$types";

export const load = (async ({ locals: { db } }) => {
    const wares = await db.collection("wares").getFullList({
        sort: "-updatedDate, -date",
        filter: "type != 'future' && type != 'whatever'"
    });
    return { wares };
}) satisfies PageServerLoad;
