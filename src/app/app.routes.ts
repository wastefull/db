import { Route, Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { DetailsComponent } from './object/details/details/details.component';
import { DefaultRouterComponent } from './default-router.component';

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
];
