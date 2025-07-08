import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { ImageDisplayComponent } from '../../../image-display/image-display.component';
import { ContentReadyService } from '../../../shared/content-ready.service';
import { PatienceComponent } from '../../../shared/patience/patience.component';
import { WindowService } from '../../../theming/window/window.service';
import { Material, defaultMaterial } from '../../object';
import { MaterialService } from '../../object.service';
import { Article } from '../article/article';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  imports: [ImageDisplayComponent, CommonModule, PatienceComponent],
  standalone: true,
})
export class DetailsComponent implements OnInit {
  object: Material = defaultMaterial;
  loading = true;

  constructor(
    private objectService: MaterialService,
    private windowService: WindowService,
    private contentReadyService: ContentReadyService,
    @Optional() @Inject('WINDOW_DATA') private windowData: any
  ) {}

  ngOnInit() {

    this.contentReadyService.setWindowLoading('details', true);

    const materialId = this.windowData?.materialId;
    if (materialId) {
      this.loadMaterial(materialId);
    }

    // Notify when ready
    setTimeout(() => {
      this.contentReadyService.notifyContentReady('details');
    }, 100); 
  }

  private loadMaterial(materialId: string) {
    this.objectService.getMaterialByName(materialId).subscribe((material) => {
      this.object = {
        ...material,
        articles: { ids: [], compost: [], recycle: [], upcycle: [] },
      };
      this.loading = false;

      this.getArticles();
    });
  }

  private getArticles() {
    this.objectService
      .getArticlesForMaterial(this.object.id)
      .subscribe((articles: Article[]) => {
        this.filterArticlesByType(articles);

        // Notify that content is ready after articles are loaded
        setTimeout(() => {
          this.contentReadyService.notifyContentReady('details');
        }, 500);
      });
  }

  private filterArticlesByType(articles: Article[]) {
    const typeTableMap: Record<
      'compost' | 'recycle' | 'upcycle',
      'Composting' | 'Recycling' | 'Upcycling'
    > = {
      compost: 'Composting',
      recycle: 'Recycling',
      upcycle: 'Upcycling',
    };

    (
      Object.keys(typeTableMap) as Array<'compost' | 'recycle' | 'upcycle'>
    ).forEach((type) => {
      const table = typeTableMap[type];
      this.object.articles[type] = articles.filter(
        (a) => (a.source_table || '').toLowerCase() === table.toLowerCase()
      );
    });
  }

  openProductPicker(articleType: 'compost' | 'recycle' | 'upcycle') {
    this.windowService.openProductPicker(
      this.object.id,
      this.object.meta.name,
      articleType
    );
  }
}
