import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MaterialService } from '../../object.service';
import { Material } from '../../object';
import { Article } from '../article/article';
import { defaultMaterial } from '../../object';
import { defaultArticle } from '../article/article';
import { ImageDisplayComponent } from '../../../image-display/image-display.component';
import { ArticleComponent } from '../article/article.component';
import { CommonModule } from '@angular/common';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  imports: [ImageDisplayComponent, ArticleComponent, CommonModule],
})
export class DetailsComponent implements OnInit {
  object: Material = defaultMaterial;
  articles: Article[] = [];
  defaultArticle: string = defaultArticle;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private objectService: MaterialService
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap((params) => {
          this.loading = true;
          // Clear the object immediately to avoid showing stale data
          this.object = {
            ...defaultMaterial,
            articles: { ids: [], compost: [], recycle: [], upcycle: [] },
          };
          const objectName = params['id'];
          return this.objectService.getMaterialByName(objectName);
        })
      )
      .subscribe((material) => {
        this.object = {
          ...material,
          articles: { ids: [], compost: [], recycle: [], upcycle: [] },
        };
        this.loading = false;
        // Use the material ID for fetching articles
        this.objectService
          .getArticlesForMaterial(this.object.id)
          .subscribe((articles: Article[]) => {
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
