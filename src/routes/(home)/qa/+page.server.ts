import { getQAs } from "$lib/fetchDB";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({locals: {db}}) => {
    return {QAs: await getQAs(db)}
};
