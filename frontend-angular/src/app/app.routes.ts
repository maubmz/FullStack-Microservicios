import { Routes } from '@angular/router';
import {ClientListComponent} from './features/client/pages/client-list/client-list.component';
import {HomePageComponent} from './features/home/pages/home-page/home-page.component';
import {ProductListComponent} from './features/product/pages/product-list/product-list.component';
import {PurchaseListComponent} from './features/purchase/pages/purchase-list/purchase-list.component';
import {ClientEditComponent} from './features/client/pages/client-edit/client-edit.component';
import {ProductEditComponent} from './features/product/pages/product-edit/product-edit.component';
import {PurchaseEditComponent} from './features/purchase/pages/purchase-edit/purchase-edit.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent
  },
  {
    path: 'clients',
    component: ClientListComponent
  },
  {
    path: 'products',
    component: ProductListComponent,
  },
  {
    path: 'purchases',
    component: PurchaseListComponent
  },
  {
    path: 'clients/edit/:id',
    component: ClientEditComponent
  },
  {
    path: 'products/edit/:id',
    component: ProductEditComponent
  },
  {
    path: 'purchases/edit/:id',
    component: PurchaseEditComponent
  },
  {
    path: '**',
    component: HomePageComponent,
  }
];
