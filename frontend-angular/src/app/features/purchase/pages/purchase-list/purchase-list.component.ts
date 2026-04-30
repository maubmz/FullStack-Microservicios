import { Component, OnInit } from '@angular/core';
import {NavbarComponent} from '../../../../shared/components/navbar/navbar.component';
import {RouterLink} from '@angular/router';
import {PurchaseService} from '../../services/purchase.service';
import {Purchase} from '../../../../shared/interfaces/purchase.model';

@Component({
  selector: 'app-purchase-list',
  imports: [
    NavbarComponent,
    RouterLink,
  ],
  templateUrl: './purchase-list.component.html',
  styleUrl: './purchase-list.component.css'
})
export class PurchaseListComponent implements OnInit {
  purchases: Purchase[] = [];
  headers: string[] = ["Id", "Client", "Productos", "Cantidad"];

  constructor(private purchaseService: PurchaseService) {}

  ngOnInit() {
    this.purchaseService.getAllPurchases().subscribe({
      next: (purchases: Purchase[]): Purchase[] => (this.purchases=purchases)
    })
  }

}
