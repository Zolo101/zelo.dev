import type PocketBase from "pocketbase";

export const getWares = (pb: PocketBase, featured: boolean) => {
    const props = {
        sort: "-date",
        filter: ""
    }

    if (featured) {
        props.filter = "featured = true";
    }

    return pb.collection<WareItem>("wares").getFullList(-1, props);
}

export const getNews = (pb: PocketBase) => {
    return pb.collection<NewsItem>("news").getFullList(-1, {
        sort: "-created",
    });
}

export const getBackgrounds = (pb: PocketBase) => {
    return pb.collection<BackgroundItem>("backgrounds").getFullList(-1, {sort: "-date"});
}

export const getQAs = (pb: PocketBase) => {
    return pb.collection<QAItem>("qa").getFullList(-1, {sort: "-created"});
}

export const getNewsArticle = (pb: PocketBase, id: string) => {
    return pb.collection<NewsItem>("news").getOne(id);
}

export const getArtifacts = (pb: PocketBase) => {
    return pb.collection<PostItem>("artifacts").getFullList(-1, {sort: "-created"});
}


// TODO: This is like 1MB :sob:
export const getCommits = (pb: PocketBase) => {
    return pb.collection<CommitsAPIResultItem>("json").getOne("sg7392pvrr7jxi9");
}