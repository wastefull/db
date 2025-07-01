import { Route, Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { DetailsComponent } from './object/details/details/details.component';
import { DefaultRouterComponent } from './default-router.component';
import { ProductPickerComponent } from './object/details/picker/product-picker/product-picker.component';
import { MethodPickerComponent } from './object/details/picker/method-picker/method-picker.component';
import { ArticleComponent } from './object/details/article/article.component';

export const routes: Routes = [
  {
    path: '',
    component: DefaultRouterComponent, // <-- primary outlet workaround
  },
  {
    path: '',
    component: SearchComponent,
    outlet: 'search',
    title: 'Search',
  },
  {
    path: 'object/:id',
    component: DetailsComponent,
    outlet: 'details',
    title: 'Details',
  },
  {
    path: 'product-picker/:objectId/:articleType',
    component: ProductPickerComponent,
    outlet: ':windowId',
  },
  {
    path: 'method-picker/:objectId/:articleType/:product',
    component: MethodPickerComponent,
    outlet: ':windowId',
  },
  {
    path: 'article/:objectId/:articleType/:product/:method',
    component: ArticleComponent,
    outlet: ':windowId',
  },
];
