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
    description: string
    link?: string;
    source?: string;
    wip: boolean;
}

declare interface PostItem extends PocketbaseItem {
    media: string;
    link: string;
    alt: string;
}

declare interface QAItem extends PocketbaseItem {
    question: string;
    questioner: string;
    answer: string;
    hidden: boolean;
}