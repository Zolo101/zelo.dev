import type { PageServerLoad } from "./$types";

const createQAId = async (ip: string) => {
    const t = ip;
    const d = new Date().toLocaleTimeString();
    const te = new TextEncoder().encode(t + d);
    const c = new Uint8Array(await crypto.subtle.digest("SHA-256", te));
    const f = Array.from(c)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    return f;
};

export const load = (async ({ locals: { db }, getClientAddress }) => {
    const questions = await db.collection<QAItem>("qa").getFullList(-1, { sort: "-created" });
    const id = await createQAId(getClientAddress());

    return { questions, id };
}) satisfies PageServerLoad;

export const actions = {
    default: async ({ request, locals: { db } }) => {
        const formData = await request.formData();
        const question = formData.get("question") as string;
        const questioner = formData.get("questioner") as string;
        await db.collection<QAItem>("qa").create({ question, questioner, hidden: false });
        return { success: true };
    }
};
