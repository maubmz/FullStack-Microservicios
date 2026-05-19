import { Routes } from '@angular/router';
import {ClientListComponent} from './features/client/pages/client-list/client-list.component';
import {HomePageComponent} from './features/home/pages/home-page/home-page.component';
import {ProductListComponent} from './features/product/pages/product-list/product-list.component';
import {PurchaseListComponent} from './features/purchase/pages/purchase-list/purchase-list.component';
import {ProductFormComponent} from './features/product/pages/product-form/product-form.component';
import {PurchaseFormComponent} from './features/purchase/pages/purchase-form/purchase-form.component';
import {ClientFormComponent} from './features/client/pages/client-form/client-form.component';

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
    component: ProductListComponent
  },
  {
    path: 'purchases',
    component: PurchaseListComponent
  },
  {
    path: 'clients/edit/:id',
    component: ClientFormComponent
  },
  {
    path: 'products/edit/:id',
    component: ProductFormComponent
  },
  {
    path: 'purchases/edit/:id',
    component: PurchaseFormComponent
  },
  {
    path: 'clients/new',
    component: ClientFormComponent
  },
  {
    path: 'purchases/new',
    component: PurchaseFormComponent
  },
  {
    path: 'products/new',
    component: ProductFormComponent
  },
  {
    path: '**',
    component: HomePageComponent
  }
];
