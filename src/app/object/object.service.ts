import { Injectable } from '@angular/core';
import { Object } from './object';
import { dummy_data } from './dummy/dummy_json';
import { environment } from '../../environments/environment';
import { connect } from 'http2';
@Injectable({
  providedIn: 'root'
})
export class ObjectService {
  protected results: Object[] = [];

  constructor() {
    this.loadGuides();
  }

  private loadGuides(): void {
    const rows = dummy_data;
    this.results = rows.map((row) => {
      const object: Object = {
        id: row.id,
        meta: {
          name: row.meta.name,
          description: row.meta.description
        },
        image: {
          url: row.image.url,
          thumbnail: row.image.thumbnail_url
        },
        risk: {
          types: row.risk.types || [],
          factors: row.risk.factors || [],
          hazards: row.risk.hazards || []
        },
        updated: {
          datetime: row.updated.datetime,
          user_id: row.updated.user_id
        },
        articles: {
          compost: row.articles.compost || [],
          recycle: row.articles.recycle || [],
          upcycle: row.articles.upcycle || []
        }
      };
      return object;
    });

      const fetchPromises = this.results.map(async (object) => {
        try {
          // Remove objects with invalid thumbnail URLs
          const response = await fetch(object.image.thumbnail, { method: 'HEAD', redirect: 'follow' });
          if (response.status !== 200) {
            return object.id; // Return the ID of the object to be removed
          }
        } catch (error) {
          return object.id; // Return the ID of the object to be removed
        }
        return null; // Return null if the thumbnail is valid
      });

      Promise.all(fetchPromises).then((invalidIds) => {
        // Remove objects with invalid IDs
        this.results = this.results.filter((object) => !invalidIds.includes(object.id));
      });
  }

  getObjects(): Object[] {
    this.loadGuides();
    return this.results;
  }
 
  getObjectById(id: string): Object | undefined {
    return this.results.find((object) => object.id === id);
  }

}
