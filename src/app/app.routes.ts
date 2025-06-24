import { Route, Routes, UrlSegment } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { DetailsComponent } from './object/details/details/details.component';

export const routes: Routes = [
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
];
