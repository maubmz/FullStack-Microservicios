import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Purchase} from '../../../shared/interfaces/purchase.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  private apiUrl = 'http://localhost:8081/purchase';

  constructor(private http: HttpClient) {}

  getAllPurchases(): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`${this.apiUrl}/allPurchases`);
  }

  getPurchaseById(id: number): Observable<Purchase> {
    return this.http.get<Purchase>(`${this.apiUrl}/${id}`);
  }

  postPurchase(purchase: Purchase): Observable<Purchase> {
    return this.http.post<Purchase>(`${this.apiUrl}/create`, purchase);
  }

  putPurchase(id: number, purchase: Purchase): Observable<Purchase> {
    return this.http.put<Purchase>(`${this.apiUrl}/update/${id}`, purchase);
  }

  deletePurchase(id: number): Observable<Purchase> {
    return this.http.delete<Purchase>(`${this.apiUrl}/delete/${id}`);
  }
}
