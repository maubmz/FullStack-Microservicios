import { Component, OnInit } from '@angular/core';
import {PurchaseService} from '../../services/purchase.service';
import {Purchase} from '../../../../shared/interfaces/purchase.model';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-purchase-list',
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './purchase-list.component.html',
  styleUrl: './purchase-list.component.css'
})
export class PurchaseListComponent implements OnInit {
  purchases: Purchase[] = [];
  title: string = "Listado de Compras";
  listHeaders: string[] = ["Id", "Cliente", "Productos", "Cantidad", "Editar"];

  constructor(private purchaseService: PurchaseService) {}

  ngOnInit() {
    this.purchaseService.getAllPurchases().subscribe({
      next: (purchases: Purchase[]) => {
        this.purchases=purchases
      }
    })
  }

}
