import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MaterialService } from '../../object.service';
import { defaultMaterial, Material } from '../../object';
import { ArticleComponent } from '../article/article.component';
import { CommonModule } from '@angular/common';
import { Article, defaultArticle } from '../article/article';
@Component({
  selector: 'app-details',
  imports: [RouterLink, ArticleComponent, CommonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent implements OnInit {
  route: ActivatedRoute = inject(ActivatedRoute);
  objectService: MaterialService = inject(MaterialService);
  public defaultArticle: string = defaultArticle;
  object: Material = defaultMaterial;
  public articles: Article[] = [];
  public handleMissingImage($event: ErrorEvent) {
    let target = $event.target as HTMLImageElement;
    target.src = defaultMaterial.image.url;
  }

  constructor() {}

  ngOnInit() {
    const objectName = this.route.snapshot.params['id'];
    this.objectService.getMaterialByName(objectName).subscribe((material) => {
      this.object = material;

      // Fetch articles
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
}
