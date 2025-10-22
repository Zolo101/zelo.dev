import { getArtifacts } from "$lib/fetchDB";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals: { db } }) => {
    return { result: await getArtifacts(db) };
};
