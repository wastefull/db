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

  public handleMissingImage($event: ErrorEvent) {
    let target = $event.target as HTMLImageElement;
    target.src = this.badImage();
  }
  public badImage(): string {
    return environment.thumbs_api + 'sample.png';
  }

  constructor() {
    const objectId = this.route.snapshot.params['id'];
    this.object = this.objectService.getObjectById(objectId);
    if (!this.object) {
      this.object = defaultObject;
      this.object.id = objectId;
      this.object.image.thumbnail = this.badImage();
      this.object.image.url = this.badImage();
      return;
    }
    const types = ['compost', 'recycle', 'upcycle'];
    if (
      types.some(
        (key) =>
          Array.isArray((this.object.articles as any)[key]) &&
          ((this.object.articles as any)[key] as any[]).length > 0
      )
    ) {
      // Flatten articles into an array with type, material, and article text
      this.articles = [];
      types.forEach((type) => {
        const articleTexts =
          this.object!.articles[type as keyof typeof this.object.articles] ||
          [];
        articleTexts.forEach((text: string) => {
          this.articles.push({
            type,
            material: this.object!.meta.name,
            article: text,
          });
        });
      });
    } else {
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
  }
}
