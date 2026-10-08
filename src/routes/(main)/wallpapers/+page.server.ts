import { getContent } from "$lib/server/content";
import type { PageServerLoad } from "./$types";

export const load = (() => ({
    wallpapers: getContent().backgrounds
})) satisfies PageServerLoad;
