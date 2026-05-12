import {Client} from './client.model';
import {Product} from './product.model';

export interface Purchase {
  idPurchase: number,
  idClient: number,
  clientName: string,
  products: Product[],
  quantity: number
}
