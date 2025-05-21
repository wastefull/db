import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ObjectService } from '../../object.service';
import { defaultObject, Object } from '../../object';
import { ArticleComponent } from '../article/article.component';
import { CommonModule } from '@angular/common';
import { Article } from '../article/article';
@Component({
  selector: 'app-details',
  imports: [RouterLink, ArticleComponent, CommonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent implements OnInit {
  route: ActivatedRoute = inject(ActivatedRoute);
  objectService: ObjectService = inject(ObjectService);
  object: Object = defaultObject;
  public articles: Article[] = [];
  public handleMissingImage($event: ErrorEvent) {
    let target = $event.target as HTMLImageElement;
    target.src = defaultObject.image.url;
  }

  constructor() {}

  ngOnInit() {
    const objectName = this.route.snapshot.params['id'];
    this.objectService
      .getMaterialByName(objectName)
      .subscribe((material: any) => {
        // Normalize: if material.fields exists, convert to Object interface
        if (material.fields) {
          this.object = {
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
              ids: material.fields.articles || {},
              compost: [],
              recycle: [],
              upcycle: [],
            },
          };
        } else {
          // Already normalized
          this.object = material;
        }

        // Now fetch and assign articles
        this.objectService
          .getArticlesForMaterial(objectName)
          .subscribe((articles: Article[]) => {
            // Group articles by source_table
            this.object.articles.compost = articles.filter((a) =>
              (a.source_table || '').toLowerCase().includes('compost')
            );
            this.object.articles.recycle = articles.filter((a) =>
              (a.source_table || '').toLowerCase().includes('recycle')
            );
            this.object.articles.upcycle = articles.filter((a) =>
              (a.source_table || '').toLowerCase().includes('upcycle')
            );
          });
      });
  }

  private getHeading(type: string): string {
    switch (type) {
      case 'compost':
        return 'How to Compost';
      case 'recycle':
        return 'How to Recycle';
      case 'upcycle':
        return 'How to Upcycle';
      case 'types':
        return 'Risk Types';
      case 'factors':
        return 'Risk Factors';
      case 'hazards':
        return 'Hazards';
      default:
        return type;
    }
  }
}
