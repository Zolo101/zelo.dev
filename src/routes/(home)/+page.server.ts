import type { PageServerLoad } from "./newest/$types";

export const load = (async ({ locals: { db } }) => {
    // remove not enough servers
    const wares = await db.collection("wares").getFullList({
        sort: "-updatedDate, -date",
        filter: "type != 'future'"
        // filter: "type = 'stable' && id != 'gonr0um2p7gpnpv'"
    });
    const contributedWares = await db.collection("wares").getFullList({
        filter: "type = 'contributed'"
    });
    return { wares, contributedWares };
}) satisfies PageServerLoad;
