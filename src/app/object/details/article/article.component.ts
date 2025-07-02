import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MaterialService } from '../../object.service';
import { Article, defaultArticle } from './article';
import { marked } from 'marked';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  standalone: true,
})
export class ArticleComponent implements OnInit {
  public defaultArticle = defaultArticle;
  articles: Article[] = [];
  material!: string;
  articleType!: string;
  product!: string;
  method!: string;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private materialService: MaterialService
  ) {}
  parseMarkdown(md: string): string {
    return marked.parse(md || '').toString();
  }
  ngOnInit() {
    this.material = this.route.snapshot.params['objectId'];
    this.articleType = this.route.snapshot.params['articleType'];
    this.product = this.route.snapshot.params['product'];
    this.method = this.route.snapshot.params['method'];
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
            this.method === 'all' || !a.method || a.method === this.method;
          return matchesType && matchesProduct && matchesMethod;
        });
        this.loading = false;
      });
  }

  public setHeading() {
    switch (this.articleType) {
      case 'compost':
        return 'How to Compost ' + this.material;
      case 'recycle':
        return 'How to Recycle ' + this.material;
      case 'upcycle':
        return 'How to Upcycle ' + this.material;
      case 'types':
        return 'Risk Type';
      case 'factors':
        return 'Risk Factor';
      case 'hazards':
        return 'Hazard';
      default:
        return 'How to Make Use of ' + this.material;
    }
  }
}
