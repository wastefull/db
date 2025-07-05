import { Component, Inject, OnInit, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowService } from '../../../../theming/window/window.service';
import { MaterialService } from '../../../object.service';

@Component({
  selector: 'app-method-picker',
  templateUrl: './method-picker.component.html',
  imports: [CommonModule],
  standalone: true,
})
export class MethodPickerComponent implements OnInit {
  methods: string[] = ['DIY', 'Industrial', 'Experimental'];
  objectId!: string;
  materialName!: string;
  articleType!: string;
  product!: string;

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
      this.product = this.windowData.product;
      this.loadMethods();
    }
  }

  private loadMethods() {
    this.materialService
      .getArticlesForMaterial(this.objectId)
      .subscribe((articles) => {
        const availableMethods = [
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

        this.methods = this.methods.filter((method) =>
          availableMethods.some((available) =>
            available.toLowerCase().includes(method.toLowerCase())
          )
        );

        if (this.methods.length === 0) {
          this.methods = ['DIY', 'Industrial', 'Experimental'];
        }
      });
  }

  pickMethod(method: string) {
    this.windowService.openArticle(
      this.objectId,
      this.materialName,
      this.articleType,
      this.product,
      method
    );
  }
}
