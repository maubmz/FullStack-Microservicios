import {Purchase} from './purchase.model';

export interface Client {
  idClient: number,
  name: string,
  email: string,
  phone: string,
  purchases: Purchase[]
}
