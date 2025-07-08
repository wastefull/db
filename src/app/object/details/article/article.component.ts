import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { marked } from 'marked';
import { ContentReadyService } from '../../../shared/content-ready.service';
import { PatienceComponent } from '../../../shared/patience/patience.component';
import { MaterialService } from '../../object.service';
import { Article, defaultArticle } from './article';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  imports: [CommonModule, PatienceComponent],
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
    private contentReadyService: ContentReadyService,
    @Optional() @Inject('WINDOW_DATA') private windowData: any
  ) {}

  parseMarkdown(md: string): string {
    return marked.parse(md || '').toString();
  }

  ngOnInit() {
    this.contentReadyService.setWindowLoading('article', true);

    if (this.windowData) {
      this.material = this.windowData.materialId;
      this.materialName = this.windowData.materialName;
      this.articleType = this.windowData.articleType;
      this.product = this.windowData.product || 'all'; // Default to 'all' if undefined
      this.method = this.windowData.method || 'all'; // Default to 'all' if undefined

      // console.log('ArticleComponent initialized with:', {
      //   material: this.material,
      //   materialName: this.materialName,
      //   articleType: this.articleType,
      //   product: this.product,
      //   method: this.method,
      // });

      this.loadArticles();
    } else {
      console.error('No window data provided to ArticleComponent');
      this.loading = false;
    }
    // Notify when ready
    setTimeout(() => {
      this.contentReadyService.notifyContentReady('article');
    }, 100); 
  }

  private loadArticles() {
    this.materialService
      .getArticlesForMaterial(this.material)
      .subscribe((articles: Article[]) => {
        // console.log('All articles in ArticleComponent:', articles);
        // console.log('Filtering with:', {
        //   articleType: this.articleType,
        //   product: this.product,
        //   method: this.method,
        // });

        this.articles = articles.filter((a) => {
          let matchesType = false;
          const sourceTable = (a.source_table || '').toLowerCase();

          // Match article type
          if (this.articleType === 'compost' && sourceTable === 'composting') {
            matchesType = true;
          } else if (
            this.articleType === 'recycle' &&
            sourceTable === 'recycling'
          ) {
            matchesType = true;
          } else if (
            this.articleType === 'upcycle' &&
            sourceTable === 'upcycling'
          ) {
            matchesType = true;
          }

          // Match product (more flexible matching)
          const matchesProduct =
            this.product === 'all' ||
            this.product === 'soil' || // Special case for compost
            !a.product ||
            a.product === this.product ||
            (a.product &&
              a.product.toLowerCase().includes(this.product.toLowerCase()));

          // Match method (more flexible matching)
          const matchesMethod =
            this.method === 'all' ||
            !a.method ||
            a.method === this.method ||
            (a.method &&
              this.method &&
              a.method.toLowerCase().includes(this.method.toLowerCase()));

          // console.log(`Article ${a.id}:`, {
          //   sourceTable: a.source_table,
          //   product: a.product,
          //   method: a.method,
          //   matchesType,
          //   matchesProduct,
          //   matchesMethod,
          //   overallMatch: matchesType && matchesProduct && matchesMethod,
          // });

          return matchesType && matchesProduct && matchesMethod;
        });

        // console.log('Filtered articles:', this.articles);
        this.loading = false;

        // Notify content is ready after articles are loaded and loading is complete
        setTimeout(() => {
          this.contentReadyService.notifyContentReady('article');
        }, 500);
      });
  }

  public setHeading() {
    return `How to ${this.articleType} ${this.materialName} using ${this.method} method to make ${this.product}`;
  }
}
