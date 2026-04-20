import { Routes } from '@angular/router';
import {ClientListComponent} from './features/client/pages/client-list/client-list.component';
import {HomePageComponent} from './features/home/pages/home-page/home-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent
  },
  {
    path: 'client',
    component: ClientListComponent
  }
];
