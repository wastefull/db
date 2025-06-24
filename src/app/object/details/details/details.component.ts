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

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  imports: [ImageDisplayComponent, ArticleComponent, CommonModule],
})
export class DetailsComponent implements OnInit {
  object: Material = defaultMaterial;
  articles: Article[] = [];
  defaultArticle: string = defaultArticle;

  constructor(
    private route: ActivatedRoute,
    private objectService: MaterialService
  ) {}

  ngOnInit() {
    // Subscribe to param changes!
    this.route.params.subscribe((params) => {
      const objectName = params['id'];
      this.objectService.getMaterialByName(objectName).subscribe((material) => {
        this.object = material;
        // Fetch articles
        this.objectService
          .getArticlesForMaterial(objectName)
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
    });
  }
}
