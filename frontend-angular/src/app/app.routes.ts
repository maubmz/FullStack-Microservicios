import { Routes } from '@angular/router';
import {ClientListComponent} from './features/client/pages/client-list/client-list.component';
import {HomePageComponent} from './features/home/pages/home-page/home-page.component';
import {ProductListComponent} from './features/product/pages/product-list/product-list.component';
import {PurchaseListComponent} from './features/purchase/pages/purchase-list/purchase-list.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent
  },
  {
    path: 'client',
    component: ClientListComponent
  },
  {
    path: 'product',
    component: ProductListComponent,
  },
  {
    path: 'purchase',
    component: PurchaseListComponent
  }
];
