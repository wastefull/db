import { Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { DetailsComponent } from './object/details/details/details.component';

export const routes: Routes = [
    {
        path: '',
        component: SearchComponent,
        title: 'Wastefull | What are you wasting?',
    },
    {
        path: 'object/:id',
        component: DetailsComponent,
        title: 'Wastefull | What can I do with this?',
    }
];
