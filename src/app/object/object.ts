import { Article } from './details/article/article';
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
    types: string[];
    factors: string[];
    hazards: string[];
  };
  updated: {
    datetime: string;
    user_id: string;
  };
  articles: {
    ids: string[];
    compost: Article[];
    recycle: Article[];
    upcycle: Article[];
  };
}

// Default object
export const defaultObject: Object = {
  id: '0',
  meta: {
    name: 'Object not found',
    description: 'Please check the URL or try searching for something else.',
  },
  image: {
    url: '/assets/placeholder.png',
    thumbnail: '/assets/placeholder.png',
  },
  risk: {
    types: [],
    factors: [],
    hazards: [],
  },
  updated: {
    datetime: 'Unknown',
    user_id: 'Unknown',
  },
  articles: {
    ids: [],
    compost: [],
    recycle: [],
    upcycle: [],
  },
};
