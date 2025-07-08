import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { ContentReadyService } from '../../../../shared/content-ready.service';
import { WindowService } from '../../../../theming/window/window.service';
import { MaterialService } from '../../../object.service';

@Component({
  selector: 'app-product-picker',
  imports: [CommonModule],
  templateUrl: './product-picker.component.html',
  standalone: true,
})
export class ProductPickerComponent implements OnInit {
  products: string[] = [];
  objectId!: string;
  materialName!: string;
  articleType!: string;

  constructor(
    private materialService: MaterialService,
    private windowService: WindowService,
    private contentReadyService: ContentReadyService,
    @Optional() @Inject('WINDOW_DATA') private windowData: any
  ) {}

  ngOnInit() {
    if (this.windowData) {
      this.objectId = this.windowData.materialId;
      this.materialName = this.windowData.materialName;
      this.articleType = this.windowData.articleType;

      // console.log('ProductPickerComponent initialized with:', {
      //   objectId: this.objectId,
      //   materialName: this.materialName,
      //   articleType: this.articleType,
      // });

      this.loadProducts();
    }
  }

  private loadProducts() {
    if (this.articleType === 'compost') {
      // For composting, default to soil
      this.products = ['soil'];
      // console.log('Compost products loaded:', this.products);

      // Notify content is ready
      setTimeout(() => {
        this.contentReadyService.notifyContentReady('picker');
      }, 500);
    } else {
      this.materialService
        .getArticlesForMaterial(this.objectId)
        .subscribe((articles) => {
          // console.log('All articles:', articles);

          const filteredArticles = articles.filter((a: any) => {
            const sourceTable = (a.source_table || '').toLowerCase();
            const targetType = this.articleType.toLowerCase();

            const matches = sourceTable === targetType + 'ing'; // recycling, upcycling

            // console.log(
              // `Article: ${a.id}, source_table: "${sourceTable}", articleType: "${targetType}ing", matches: ${matches}`
            // );
            return matches;
          });

          const products = [
            ...new Set(
              filteredArticles
                .map((a: any) => a.product)
                .filter((p: string | undefined): p is string => !!p)
            ),
          ] as string[];

          this.products = products;
          // console.log('Loaded products:', this.products);

          // Notify content is ready after products are loaded
          setTimeout(() => {
            this.contentReadyService.notifyContentReady('picker');
          }, 500);
        });
    }
  }

  pickProduct(product: string) {
    // console.log('Product picked:', product);
    this.windowService.openMethodPicker(
      this.objectId,
      this.materialName,
      this.articleType,
      product
    );
  }
}
