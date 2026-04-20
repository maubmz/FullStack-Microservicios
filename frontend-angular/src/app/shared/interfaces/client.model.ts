import {Purchase} from './purchase.model';

export interface Client {
  id: number,
  name: string,
  email: string,
  phoneNumber: string,
  purchases: Purchase[]
}
