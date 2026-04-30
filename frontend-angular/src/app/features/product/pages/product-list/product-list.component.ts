import {Component, OnInit} from '@angular/core';
import {NavbarComponent} from '../../../../shared/components/navbar/navbar.component';
import {RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Product} from '../../../../shared/interfaces/product.model';
import {ProductService} from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  imports: [
    NavbarComponent,
    RouterLink,
    CommonModule
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit{
  products: Product[] = [];
  headersTable: string[] = ["Id", "Nombre", "Precio", "Stock"];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getAllProducts().subscribe({
      next: (product: Product[]): Product[] => (this.products = product),
      }
    )
  }

}
