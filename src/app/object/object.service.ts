import { Injectable } from '@angular/core';
import { Object } from './object';
import { trunc_data } from './dummy/dummy';
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
    const rows = trunc_data.split('\n').slice(1); // Split by rows and skip the header
    this.results = rows
      .filter((row) => row.trim() !== '') // Remove empty rows
      .map((row) => {
        let [id, name, altNames, thumbnail, tags, shortname] = row.split(','); // Split by commas
        if (!shortname || shortname.includes('http')) { shortname = name.trim().toLowerCase().replace(/ /g, '-'); } // Generate shortname if not provided
        return {
          id: id.trim(),
          name: name.trim().replace(/&amp;/g, '&'),
          altNames: altNames ? altNames.split('|').map((alt) => alt.trim()) : [], // Split altNames by '|'
          thumbnail: environment.thumbs_api + shortname.trim().replace(/-/g, '').trim() + '.jpg',
          tags: tags ? tags.split('|').map((tag) => tag.trim().toLowerCase()) : [], // Split tags by '|'
          shortname: shortname.trim()
        } as Object;
      });
      const fetchPromises = this.results.map(async (object) => {
        try {
          const response = await fetch(object.thumbnail, { method: 'HEAD', redirect: 'follow' });
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
  // getObjectsByTag(tag: string): Object[] {
  //   return this.results.filter((object) => object.tags.includes(tag));
  // }
  // getObjectsByName(name: string): Object[] {
  //   return this.results.filter((object) => object.name.includes(name));
  // }
  // getObjectsByAltName(altName: string): Object[] {  
  //   return this.results.filter((object) => object.altNames.includes(altName));
  // }

}
