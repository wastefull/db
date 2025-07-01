import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { WindowService } from '../../../theming/window/window.service';
import { NavigationService } from '../../../navigation.service';
import { IonicModule } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  imports: [ImageDisplayComponent, CommonModule, IonicModule],
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit, OnDestroy {
  object: Material = defaultMaterial;
  articles: Article[] = [];
  defaultArticle: string = defaultArticle;
  loading = false;
  private navigationSub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private objectService: MaterialService,
    private windowService: WindowService,
    private navigationService: NavigationService
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

    // Subscribe to navigation events and update window title
    this.navigationSub = this.navigationService.navigation$.subscribe(
      ({ outlet, path }) => {
        if (outlet === 'article' && Array.isArray(path)) {
          let title = '';
          if (path[0] === 'product-picker') {
            title = 'Pick a Product';
          } else if (path[0] === 'method-picker') {
            title = 'Pick a Method';
          } else if (path[0] === 'article') {
            title = this.getArticleHeading(path[2]);
          }
          this.windowService.updateWindowTitle('article', title);
        }
      }
    );
  }

  ngOnDestroy() {
    this.navigationSub?.unsubscribe();
  }

  openProductPicker(articleType: 'compost' | 'recycle' | 'upcycle') {
    this.windowService.addWindow({
      id: 'article',
      title: `Pick a Product`,
      icon: 'fa-box',
      isActive: true,
      isMinimized: false,
      isMaximized: false,
      buttons: [],
      outlet: 'article',
    });
    this.navigationService.requestNavigation('article', [
      'product-picker',
      this.object.id,
      articleType,
    ]);
  }

  private getArticleHeading(articleType: string): string {
    switch (articleType) {
      case 'compost':
        return 'How to Compost ' + (this.object.meta.name || '');
      case 'recycle':
        return 'How to Recycle ' + (this.object.meta.name || '');
      case 'upcycle':
        return 'How to Upcycle ' + (this.object.meta.name || '');
      default:
        return 'How to Make Use of ' + (this.object.meta.name || '');
    }
  }
}
