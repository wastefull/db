import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MaterialService } from '../../../object.service';
import { NavigationService } from '../../../../navigation.service';
import { IonicModule } from '@ionic/angular';
@Component({
  selector: 'app-product-picker',
  imports: [IonicModule],
  templateUrl: './product-picker.component.html',
  styleUrl: './product-picker.component.scss',
  providers: [MaterialService],
  standalone: true,
})
export class ProductPickerComponent implements OnInit {
  products: string[] = [];
  objectId!: string;
  articleType!: string;
  windowId!: string;

  constructor(
    private route: ActivatedRoute,
    private materialService: MaterialService,
    private navigationService: NavigationService
  ) {}

  ngOnInit() {
    this.objectId = this.route.snapshot.params['objectId'];
    this.articleType = this.route.snapshot.params['articleType'];
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
          // If no products, allow fallback
        });
    }
  }

  pickProduct(product: string) {
    console.log('pickProduct called with:', product);
    this.navigationService.requestNavigation('article', [
      'method-picker',
      this.objectId,
      this.articleType,
      product,
    ]);
  }
}
