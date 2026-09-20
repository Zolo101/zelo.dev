import { getContent } from "$lib/server/content";
import type { PageServerLoad } from "./$types";

export const load = (() => ({
    artifacts: getContent().artifacts
})) satisfies PageServerLoad;
