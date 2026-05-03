import { Component, OnInit } from '@angular/core';
import {PurchaseService} from '../../services/purchase.service';
import {Purchase} from '../../../../shared/interfaces/purchase.model';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { TableColumn } from '../../../../shared/interfaces/tableColumn.model';

@Component({
  selector: 'app-purchase-list',
  imports: [
    TableComponent,
  ],
  templateUrl: './purchase-list.component.html',
  styleUrl: './purchase-list.component.css'
})
export class PurchaseListComponent implements OnInit {
  purchases: Purchase[] = [];
  columnsPurchases: TableColumn<Purchase>[] = [
    {key: 'id', label: 'Id'},
    {key: 'client', label: "Nombre Cliente", formatter: client => client.id},
    {key: 'products', label: "Producto", formatter: purchase => 
      purchase.products.map(product => product.name).join(', ')
    },
    {key: 'quantity', label: 'Cantidad'},
    {key: 'edit', label: "Editar"}
  ];
  title: string = "Listado de Compras";

  constructor(private purchaseService: PurchaseService) {}

  ngOnInit() {
    this.purchaseService.getAllPurchases().subscribe({
      next: (purchases: Purchase[]): Purchase[] => (this.purchases=purchases)
    })
  }

}
