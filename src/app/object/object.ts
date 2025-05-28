import { Article } from './details/article/article';
export interface Material {
  id: string;
  meta: {
    name: string;
    description: string;
  };
  image: {
    url: string;
    thumbnail: string;
    photographer?: {
      username: string;
      profile_url: string;
    };
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
export const defaultMaterial: Material = {
  id: '0',
  meta: {
    name: 'Object not found',
    description: 'Please check the URL or try searching for something else.',
  },
  image: {
    url: '/assets/placeholder.png',
    thumbnail: '/assets/placeholder.png',
    photographer: {
      username: 'No image found.',
      profile_url: '',
    },
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
