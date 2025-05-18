// Date class as a string
type DateString = string;

declare interface PocketbaseItem {
    id: string;
    collectionId: string;
    collectionName: string;
    created: DateString;
    updated: DateString;
}

declare interface BackgroundItem extends PocketbaseItem {
    name: string;
    media: string;
    source?: string;
    date: DateString;
    madeIn: "blender" | "paint.net";
    info: string;
}

declare interface WareItem extends PocketbaseItem {
    name: string;
    icon: string;
    date: DateString;
    description: string;
    link?: string;
    source?: string;
    featured: boolean;
    type: "future" | "stable" | "contributed" | "legacy";
}

declare interface PostItem extends PocketbaseItem {
    media: string;
    link: string;
    alt: string;
}

declare interface NewsItem extends PocketbaseItem {
    header: string;
    header_img: string;
    blurb: string;
    article: string;
    hide: boolean;
}

declare interface QAItem extends PocketbaseItem {
    question: string;
    questioner: string;
    answer: string;
    hidden: boolean;
}

declare interface CommitsAPIResultItem extends PocketbaseItem {
    data: any; // Json of the github api result
}
