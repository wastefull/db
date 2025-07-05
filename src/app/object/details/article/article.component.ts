import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { marked } from 'marked';
import { MaterialService } from '../../object.service';
import { Article, defaultArticle } from './article';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  imports: [CommonModule],
  standalone: true,
})
export class ArticleComponent implements OnInit {
  public defaultArticle = defaultArticle;
  articles: Article[] = [];
  material!: string;
  materialName!: string;
  articleType!: string;
  product!: string;
  method!: string;
  loading = true;

  constructor(
    private materialService: MaterialService,
    @Optional() @Inject('WINDOW_DATA') private windowData: any
  ) {}

  parseMarkdown(md: string): string {
    return marked.parse(md || '').toString();
  }

  ngOnInit() {
    if (this.windowData) {
      this.material = this.windowData.materialId;
      this.materialName = this.windowData.materialName;
      this.articleType = this.windowData.articleType;
      this.product = this.windowData.product;
      this.method = this.windowData.method;
      this.loadArticles();
    }
  }

  private loadArticles() {
    this.materialService
      .getArticlesForMaterial(this.material)
      .subscribe((articles: Article[]) => {
        this.articles = articles.filter((a) => {
          const matchesType = (a.source_table || '')
            .toLowerCase()
            .includes(this.articleType);
          const matchesProduct =
            this.product === 'all' || !a.product || a.product === this.product;
          const matchesMethod =
            this.method === 'all' ||
            !a.method ||
            (a.method &&
              a.method.toLowerCase().includes(this.method.toLowerCase()));
          return matchesType && matchesProduct && matchesMethod;
        });
        this.loading = false;
      });
  }

  public setHeading() {
    return `How to ${this.articleType} ${this.materialName} using ${this.method} method to make ${this.product}`;
  }
}
