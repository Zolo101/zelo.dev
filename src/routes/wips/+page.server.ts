import type { PageServerLoad } from "./$types";

export const load = (async ({ locals: { db } }) => {
    const inprogress = await db.collection("wares").getFullList({
        sort: "-updatedDate, -date",
        filter: "type = 'future'"
    });

    const whatevers = await db.collection("wares").getFullList({
        sort: "-updatedDate, -date",
        filter: "type = 'whatever'"
    });
    return { inprogress, whatevers };
}) satisfies PageServerLoad;
