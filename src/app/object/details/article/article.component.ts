import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-article',
  imports: [CommonModule],
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss',
})
export class ArticleComponent {
  public defaultArticle = `Articles will cover the uses of the object, as well as potential issues
    its decomposition (or lack thereof) can create. Below will be cards for
    the object's compostability, recyclability, reuseability, possible hazards,
    ecological role, and a showcase of examples of its creative reuse.`;
  @Input() material!: string;
  @Input() article!: string;
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
