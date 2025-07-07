import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, Optional } from '@angular/core';
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
    @Optional() @Inject('WINDOW_DATA') private windowData: any
  ) {}

  ngOnInit() {
    if (this.windowData) {
      this.objectId = this.windowData.materialId;
      this.materialName = this.windowData.materialName;
      this.articleType = this.windowData.articleType;
      this.loadProducts();
    }
  }

  private loadProducts() {
    if (this.articleType === 'compost') {
      if (this.products.length === 0) {
        this.products = ['soil'];
      }
    } else {
      this.materialService
        .getArticlesForMaterial(this.objectId)
        .subscribe((articles) => {
          console.log('All articles:', articles);

          const filteredArticles = articles.filter((a: any) => {
            const sourceTable = a.source_table || '';

            let matches = false;
            if (this.articleType === 'upcycle' && sourceTable === 'Upcycling') {
              matches = true;
            } else if (
              this.articleType === 'recycle' &&
              sourceTable === 'Recycling'
            ) {
              matches = true;
            } else if (
              this.articleType === 'compost' &&
              sourceTable === 'Composting'
            ) {
              matches = true;
            }

            console.log(
              `Article: ${a.id}, source_table: "${sourceTable}", articleType: "${this.articleType}", matches: ${matches}`
            );
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
          console.log('Loaded products:', this.products);
        });
    }
  }

  pickProduct(product: string) {
    this.windowService.openMethodPicker(
      this.objectId,
      this.materialName,
      this.articleType,
      product
    );
  }
}
