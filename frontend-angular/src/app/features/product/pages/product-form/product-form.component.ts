import {Component, OnInit} from '@angular/core';
import {ProductService} from '../../services/product.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {Product} from '../../../../shared/interfaces/product.model';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-product-form',
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit {

  product: Product = {
    name: '',
    price: 0.0,
    stock: 0
  };

  constructor(private productService: ProductService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    const productId: string | null = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.product.id = +productId;
      this.getInfoProduct(this.product.id);
    }
  }

  getInfoProduct(id: number): void {
    if(this.product.id) {
      this.productService.getProductById(id).subscribe(product => {
        this.product = product;
      })
    }
  }

  saveProduct(): void {
    if (this.product.id) {
      console.log("Actualizacion de producto");
      this.productService.putProduct(this.product.id, this.product)
        .subscribe(() => this.router.navigate(['products']));
    } else {
      console.log("Creacion de producto");
      this.productService.postProduct(this.product)
        .subscribe(() => this.router.navigate(['products']));
    }
  }

}
