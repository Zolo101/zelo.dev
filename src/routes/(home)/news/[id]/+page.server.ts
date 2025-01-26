import type { PageServerLoad } from "./$types";
import { getNewsArticle} from "$lib/fetchDB";

export const load: PageServerLoad = async ({params, locals: {db}}) => {
    return {article: await getNewsArticle(db, params.id)}
};
