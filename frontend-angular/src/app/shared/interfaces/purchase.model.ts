import {Client} from './client.model';
import {Product} from './product.model';

export interface Purchase {
  id: number,
  client: Client,
  products: Product[],
  quantity: number
}
