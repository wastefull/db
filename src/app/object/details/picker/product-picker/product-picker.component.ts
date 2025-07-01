import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialService } from '../../../object.service';
import { NavigationService } from '../../../../navigation.service';

@Component({
  selector: 'app-product-picker',
  imports: [],
  templateUrl: './product-picker.component.html',
  styleUrl: './product-picker.component.scss',
  providers: [MaterialService],
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
    this.windowId = this.route.outlet;
    this.materialService
      .getArticlesForMaterial(this.objectId)
      .subscribe((articles) => {
        this.products = [
          ...new Set(
            articles
              .filter((a: any) =>
                (a.source_table || '').toLowerCase().includes(this.articleType)
              )
              .map((a: any) => a.product)
              .filter((p: string | undefined) => !!p)
          ),
        ] as string[];
      });
  }

  pickProduct(product: string) {
    this.navigationService.requestNavigation(this.windowId, [
      'method-picker',
      this.objectId,
      this.articleType,
      product,
    ]);
  }
}
