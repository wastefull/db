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
    url: 'https://v5.airtableusercontent.com/v3/u/41/41/1747346400000/30XVpBHJLwE5I0qpedH0Fw/CS6TX5UQUaY94MFdu6yaukGoKQn_cB7TvFL5KaOXLVYWymWC8ibP49pvBWuX8XczBydV_a2YUSE6c8rvQxURP_-39BrNbp43wsgLDiq-8F4As1cssI-GGKNjlqGrFxbtEvqN_aE_PU7FcDWEX1Q--w/BiOtlcx7CtsVXBRx2w-CK9q-R25hPCA7Onvs2utjDGo',
    thumbnail:
      'https://v5.airtableusercontent.com/v3/u/41/41/1747346400000/ysGeoA18pq3Y37zUue711g/S_r6E3O7oKBbNoL8cKVaDX6hR-c7V6HDG2scHuLvO0bldeZJdwM9JTOPdrPqUqqa-20lrtHcX05pJNpDTeJaELP8tT-rO3keLlUP4taQEyAW543LzJz8f976ApBcCryLAQ64g6pSBxfiV77_7bm1tw/TS2y4slr2CCDqP0F0c601JVILWXvjqKrdgOA0xJ99ys',
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
