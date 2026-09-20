import { getContent } from "$lib/server/content";
import type { PageServerLoad } from "./$types";

export const load = (() => ({
    zeals: getContent().zeal
})) satisfies PageServerLoad;
