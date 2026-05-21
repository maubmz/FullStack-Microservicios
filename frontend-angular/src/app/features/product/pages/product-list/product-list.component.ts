import {Component, OnInit} from '@angular/core';
import {Product} from '../../../../shared/interfaces/product.model';
import {ProductService} from '../../services/product.service';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-product-list',
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit{
  products: Product[] = [];
  title: string = "Listado de Productos";
  listHeaders: string[] = ["Id", "Nombre", "Precio", "Stock", "Editar", "Eliminar"];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getAllProducts().subscribe({
      next: (product: Product[]): Product[] => (this.products = product),
      }
    )
  }

  deleteProduct(product: Product): void {
    const confirmed = confirm(
      `Desea eliminar el producto "${product.name}" ?`
    );

    if (confirmed && product.id) {
      this.productService.deleteProduct(product.id)
        .subscribe(() => {
          window.location.reload();
          this.productService.getAllProducts().subscribe();
        })
    }
  }

}
