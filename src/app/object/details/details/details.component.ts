import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ObjectService } from '../../object.service';
import { defaultObject, Object } from '../../object';
import { environment } from '../../../../environments/environment';
import { ArticleComponent } from '../article/article.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-details',
  imports: [RouterLink, ArticleComponent, CommonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  objectService: ObjectService = inject(ObjectService);
  object: Object;
  public articles: { type: string; material: string; article: string }[] = [];
  public groupedArticles: ArticleGroup[] = [];
  public handleMissingImage($event: ErrorEvent) {
    let target = $event.target as HTMLImageElement;
    target.src = defaultObject.image.url;
  }

  constructor() {
    const objectId = this.route.snapshot.params['id'];
    this.object = this.objectService.getObjectById(objectId);
    if (!this.object) {
      this.object = defaultObject;
      this.object.id = objectId;
      this.object.image.thumbnail = defaultObject.image.url;
      this.object.image.url = defaultObject.image.url;
      return;
    }
    const articleTypes = ['compost', 'recycle', 'upcycle'];
    const riskTypes = ['types', 'factors', 'hazards'];
    this.articles = [];

    // Populate articles from the object
    this.populateFromSource(this.object!.articles, articleTypes);
    this.populateFromSource(this.object!.risk, riskTypes);

    // If still empty, show the default message
    if (this.articles.length === 0) {
      this.articles = [
        {
          type: 'contribute to our knowledge of ',
          material: this.object!.meta.name,
          article: `<p>Articles will cover the uses of the object, as well as potential issues
        its decomposition (or lack thereof) can create. Below will be cards for
        the object's compostability, recyclability, reuseability, possible hazards,
        ecological role, and a showcase of examples of its creative reuse.
        This object is not yet in our database, and we are working to add it.</p>
        <p>If you have any information on this object, please let us know! We are
        looking for articles, images, and any other information you may have.</p>
        <p>Please submit any articles you may have on this object to help us and share your ideas!</p>`,
        },
      ];
    }

    const allTypes = [
      ...articleTypes.map((type) => ({
        type,
        heading: this.getHeading(type),
        items:
          this.object!.articles[type as keyof typeof this.object.articles] ||
          [],
      })),
      ...riskTypes.map((type) => ({
        type,
        heading: this.getHeading(type),
        items: this.object!.risk[type as keyof typeof this.object.risk] || [],
      })),
    ];

    this.groupedArticles = allTypes
      .filter((group) => group.items.length > 0)
      .map((group) => ({
        type: group.type,
        heading: group.heading,
        articles: group.items.map((id: string) => ({
          id,
          material: this.object!.meta.name,
          article: id, // For now, just the ID; later, fetch the article text/title by ID
        })),
      }));
  }

  private populateFromSource(
    source: Record<string, string[]>,
    types: string[]
  ) {
    types.forEach((type) => {
      const texts = source[type] || [];
      texts.forEach((text: string) => {
        this.articles.push({
          type,
          material: this.object!.meta.name,
          article: text,
        });
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

type ArticleGroup = {
  type: string;
  heading: string;
  articles: { id: string; material: string; article: string }[];
};
