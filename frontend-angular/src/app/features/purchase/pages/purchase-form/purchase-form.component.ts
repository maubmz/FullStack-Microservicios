import {Component, OnInit} from '@angular/core';
import {Purchase} from '../../../../shared/interfaces/purchase.model';
import {PurchaseService} from '../../services/purchase.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {Product} from '../../../../shared/interfaces/product.model';
import {ProductService} from '../../../product/services/product.service';

@Component({
  selector: 'app-purchase-form',
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './purchase-form.component.html',
  styleUrl: './purchase-form.component.css'
})
export class PurchaseFormComponent implements OnInit {
  products: Product[] = [];
  purchase: Purchase = {
    idClient: 0,
    clientName: '',
    products: [],
    quantity: 0
  };

  constructor(private purchaseService: PurchaseService,
              private productService: ProductService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    const purchaseId: string | null = this.route.snapshot.paramMap.get('id');
    this.productService.getAllProducts().subscribe({
        next: (products: Product[]) => {this.products=products},
      }
    );
    if (purchaseId) {
      this.purchase.idPurchase = +purchaseId;
      this.getInfoPurchase(this.purchase.idPurchase);
    }
  }

  getInfoPurchase(id: number): void {
    if (this.purchase.idPurchase) {
      this.purchaseService.getPurchaseById(id).subscribe(purchase => {
        this.purchase = purchase;
      })
    }
  }

  savePurchase(): void {
    if (this.purchase.idPurchase) {
      this.purchaseService.putPurchase(this.purchase.idPurchase, this.purchase)
        .subscribe(() => this.router.navigate(['purchases']));
    } else {
      this.purchaseService.postPurchase(this.purchase)
        .subscribe(() => this.router.navigate(['purchases']));
    }
  }

  onCheckboxChange(event: any, product: Product): void {
    if (event.target.checked) {
      this.purchase.products.push(product);
    } else {
      this.purchase.products = this.purchase.products.filter(p => p.id !== product.id);
    }
  }

  isProductSelected(id: number | undefined): boolean {
    for (let p of this.purchase.products) {
      if (p.id === id) {
        return true;
      }
    }
    return false;
  }

}
