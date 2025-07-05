import { Component, Inject, OnInit, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
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
      this.products = ['soil'];
    } else {
      this.materialService
        .getArticlesForMaterial(this.objectId)
        .subscribe((articles) => {
          const products = [
            ...new Set(
              articles
                .filter((a: any) =>
                  (a.source_table || '')
                    .toLowerCase()
                    .includes(this.articleType)
                )
                .map((a: any) => a.product)
                .filter((p: string | undefined): p is string => !!p)
            ),
          ] as string[];
          this.products = products;
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
