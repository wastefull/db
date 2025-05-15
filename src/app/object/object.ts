export interface Object {
    id: string;
    meta: {
        name: string;
        description: string;
    };
    image: {
        url: string;
        thumbnail: string;
    };
    risk: {
        "types": string[];
        "factors": string[];
        "hazards": string[];
    };
    updated: {
        datetime: string;
        user_id: string;
    }
    articles: {
        compost: string[];
        recycle: string[];
        upcycle: string[];
    }
}