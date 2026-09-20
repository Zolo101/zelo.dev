import { getContent } from "$lib/server/content";
import type { PageServerLoad } from "./$types";

export const load = (() => ({
    wares: getContent().wares.filter((ware) => ware.type !== "future" && ware.type !== "whatever")
})) satisfies PageServerLoad;
