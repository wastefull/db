import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { ImageDisplayComponent } from '../../../image-display/image-display.component';
import { WindowService } from '../../../theming/window/window.service';
import { Material, defaultMaterial } from '../../object';
import { MaterialService } from '../../object.service';
import { Article } from '../article/article';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  imports: [ImageDisplayComponent, CommonModule],
  standalone: true,
})
export class DetailsComponent implements OnInit {
  object: Material = defaultMaterial;
  loading = true;

  constructor(
    private objectService: MaterialService,
    private windowService: WindowService,
    @Optional() @Inject('WINDOW_DATA') private windowData: any
  ) {}

  ngOnInit() {
    const materialId = this.windowData?.materialId;
    if (materialId) {
      this.loadMaterial(materialId);
    }
  }

  private loadMaterial(materialId: string) {
    this.objectService.getMaterialByName(materialId).subscribe((material) => {
      this.object = {
        ...material,
        articles: { ids: [], compost: [], recycle: [], upcycle: [] },
      };
      this.loading = false;

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
  }

  openProductPicker(articleType: 'compost' | 'recycle' | 'upcycle') {
    this.windowService.openProductPicker(
      this.object.id,
      this.object.meta.name,
      articleType
    );
  }
}
