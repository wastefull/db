import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Article, defaultArticle } from './article';

@Component({
  selector: 'app-article',
  imports: [CommonModule],
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss',
})
export class ArticleComponent {
  public defaultArticle = defaultArticle;
  @Input() material!: string;
  @Input() article!: Article;
  @Input() articleType!: string;
  public setHeading() {
    // Set the heading based on the type
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
        return 'How to ' + this.articleType + ' ' + this.material;
    }
  }
}
