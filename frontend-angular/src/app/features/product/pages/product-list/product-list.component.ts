import {Component, OnInit} from '@angular/core';
import {Product} from '../../../../shared/interfaces/product.model';
import {ProductService} from '../../services/product.service';
import { TableColumn } from '../../../../shared/interfaces/tableColumn.model';
import { TableComponent } from '../../../../shared/components/table/table.component';

@Component({
  selector: 'app-product-list',
  imports: [
    TableComponent
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit{
  products: Product[] = [];
  columnsProducts: TableColumn<Product>[] = [
    {key: 'id', label: 'Id'},
    {key: 'name', label:'Nombre Producto'},
    {key: 'price', label:'Precio Product'},
    {key: 'stock', label: 'Stock'},
    {key: 'edit', label:'Editar'}
  ]
  title: string = "Listado de Productos";

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getAllProducts().subscribe({
      next: (product: Product[]): Product[] => (this.products = product),
      }
    )
  }

}
