// Date class as a string
type DateString = string;

// TODO: Use the pocketbase sdk types when available
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
    updatedDate: DateString;
    updateText: string;
    description: string;
    link?: string;
    source?: string;
    featured: boolean;
    type: "future" | "stable" | "contributed" | "legacy";
    hidden: boolean;
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
