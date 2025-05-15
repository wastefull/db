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
    compost: string[];
    recycle: string[];
    upcycle: string[];
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
    compost: [],
    recycle: [],
    upcycle: [],
  },
};
