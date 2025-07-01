import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MaterialService } from '../../../object.service';
import { NavigationService } from '../../../../navigation.service';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-method-picker',
  templateUrl: './method-picker.component.html',
  styleUrl: './method-picker.component.scss',
  imports: [IonicModule],
  standalone: true,
})
export class MethodPickerComponent implements OnInit {
  methods: string[] = [];
  objectId!: string;
  articleType!: string;
  product!: string;
  windowId!: string;

  constructor(
    private route: ActivatedRoute,
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
        const methods = [
          ...new Set(
            articles
              .filter(
                (a: any) =>
                  (a.source_table || '')
                    .toLowerCase()
                    .includes(this.articleType) &&
                  (this.product === 'all' || a.product === this.product)
              )
              .map((a: any) => a.method)
              .filter((m: string | undefined): m is string => !!m)
          ),
        ] as string[];
        this.methods = methods; // fallback
      });
  }

  pickMethod(method: string) {
    this.navigationService.requestNavigation('article', [
      'article',
      this.objectId,
      this.articleType,
      this.product,
      method,
    ]);
  }
}
