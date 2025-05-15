import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-article',
  imports: [],
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
  @Input() type!: string;
}
