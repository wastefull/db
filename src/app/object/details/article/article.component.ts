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
        console.log('All articles in ArticleComponent:', articles);
        console.log('Filtering with:', {
          articleType: this.articleType,
          product: this.product,
          method: this.method,
        });

        this.articles = articles.filter((a) => {
          let matchesType = false;
          const sourceTable = a.source_table || '';

          if (this.articleType === 'compost' && sourceTable === 'Composting') {
            matchesType = true;
          } else if (
            this.articleType === 'recycle' &&
            sourceTable === 'Recycling'
          ) {
            matchesType = true;
          } else if (
            this.articleType === 'upcycle' &&
            sourceTable === 'Upcycling'
          ) {
            matchesType = true;
          }

          const matchesProduct =
            this.product === 'all' ||
            this.product === 'soil' || // Special case for compost
            !a.product ||
            a.product === this.product;

          const matchesMethod =
            this.method === 'all' ||
            !a.method ||
            (a.method &&
              a.method.toLowerCase().includes(this.method.toLowerCase()));

          console.log(`Article ${a.id}:`, {
            sourceTable,
            product: a.product,
            method: a.method,
            matchesType,
            matchesProduct,
            matchesMethod,
            overallMatch: matchesType && matchesProduct && matchesMethod,
          });

          return matchesType && matchesProduct && matchesMethod;
        });

        console.log('Filtered articles:', this.articles);
        this.loading = false;
      });
  }

  public setHeading() {
    return `How to ${this.articleType} ${this.materialName} using ${this.method} method to make ${this.product}`;
  }
}
