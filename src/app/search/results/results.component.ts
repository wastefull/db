import { Component, inject, Inject, Input } from '@angular/core';
import { ObjectComponent } from '../../object/object.component';
import { CommonModule } from '@angular/common';
import { ObjectService } from '../../object/object.service';
import { Object } from '../../object/object';
@Component({
  selector: 'app-results',
  imports: [ObjectComponent, CommonModule],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss',
})
export class ResultsComponent {
  results: Object[] = [];
  everything: Object[] = [];

  constructor(public objectService: ObjectService) {
    this.objectService.getObjects().subscribe((objects: any[]) => {
      const normalized = objects.map((material: any) => {
        if (material.fields) {
          return {
            id: material.id,
            meta: {
              name: material.fields.Name || '',
              description: material.fields.Description || '',
            },
            image: {
              url: material.fields.Image?.[0]?.url || '/assets/placeholder.png',
              thumbnail:
                material.fields.Image?.[0]?.thumbnails?.small?.url ||
                '/assets/placeholder.png',
            },
            risk: {
              types: material.fields['Risk Types (from Risks)'] || [],
              factors:
                material.fields['Risk Factors (from Hazards) (from Risks)'] ||
                [],
              hazards: material.fields['Hazards (from Risks)'] || [],
            },
            updated: {
              datetime: material.fields['Last Modified'] || '',
              user_id: material.fields['Last Modified By']?.id || '',
            },
            articles: {
              ids: material.fields.articles || [],
              compost: [],
              recycle: [],
              upcycle: [],
            },
          } as Object;
        } else {
          return material;
        }
      });
      this.everything = normalized;
      this.results = normalized;
    });
  }

  search(query: string): void {
    if (query) {
      this.results = this.everything.filter((object) =>
        object.meta.name.toLowerCase().includes(query.toLowerCase())
      );
    } else {
      this.results = this.everything;
    }
  }
  // require input
  @Input()
  set query(value: string) {
    this.search(value);
  }
}
