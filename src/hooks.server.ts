import type { Handle } from "@sveltejs/kit";
import PocketBase from "pocketbase";

export const handle: Handle = async ({ event, resolve }) => {
    event.locals.db = new PocketBase("https://cdn.zelo.dev");

    return resolve(event);
};
