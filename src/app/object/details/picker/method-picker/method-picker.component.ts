import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Inject } from '@angular/core';
import { MaterialService } from '../../../object.service';
import { NavigationService } from '../../../../navigation.service';

@Component({
  selector: 'app-method-picker',
  templateUrl: './method-picker.component.html',
  styleUrl: './method-picker.component.scss',
  standalone: true,
  imports: [],
})
export class MethodPickerComponent implements OnInit {
  methods: string[] = [];
  objectId!: string;
  articleType!: string;
  product!: string;
  windowId!: string;
  route: any;

  constructor(
    private materialService: MaterialService,
    private navigationService: NavigationService
  ) {}

  ngOnInit() {
    this.objectId = this.route.snapshot.params['objectId'];
    this.articleType = this.route.snapshot.params['articleType'];
    this.product = this.route.snapshot.params['product'];
    this.windowId = this.route.outlet;
    this.materialService
      .getArticlesForMaterial(this.objectId)
      .subscribe((articles) => {
        this.methods = [
          ...new Set(
            articles
              .filter(
                (a: any) =>
                  (a.source_table || '')
                    .toLowerCase()
                    .includes(this.articleType) && a.product === this.product
              )
              .map((a: any) => a.method)
              .filter((m: string | undefined) => !!m)
          ),
        ] as string[];
      });
  }

  pickMethod(method: string) {
    this.navigationService.requestNavigation(this.windowId, [
      'article',
      this.objectId,
      this.articleType,
      this.product,
      method,
    ]);
  }
}
