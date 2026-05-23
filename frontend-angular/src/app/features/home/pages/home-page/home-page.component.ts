import {Component, OnInit} from '@angular/core';
import {NavbarComponent} from '../../../../shared/components/navbar/navbar.component';
import {ProductService} from '../../../product/services/product.service';
import {Product} from '../../../../shared/interfaces/product.model';

@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit{
  productsWithMinusStock: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getProductsWithMinusStock().subscribe({
      next: (products: Product[]): Product[] => (this.productsWithMinusStock = products),
    })
  }

}
