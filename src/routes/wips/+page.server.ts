import { getContent } from "$lib/server/content";
import type { PageServerLoad } from "./$types";

export const load = (() => ({
    inprogress: getContent().wares.filter((ware) => ware.type === "future"),
    whatevers: getContent().wares.filter((ware) => ware.type === "whatever")
})) satisfies PageServerLoad;
