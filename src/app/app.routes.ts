import { Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { DetailsComponent } from './object/details/details/details.component';

export const routes: Routes = [
  {
    path: '',
    component: SearchComponent,
    outlet: 'window1',
    title: 'Search',
  },
  {
    path: 'object/:id',
    component: DetailsComponent,
    outlet: 'window2',
    title: 'What can I do with this?',
  },
];
