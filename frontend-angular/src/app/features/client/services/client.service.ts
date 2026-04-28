import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../../../shared/interfaces/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private apiUrl : string= 'http://localhost:8081/client';

  constructor(private http: HttpClient) {}

  getAllClient(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/allClients`);
  }

  getClientById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }

  postClient(client: Client): Observable<Client> {
    return this.http.post<Client>(`${this.apiUrl}/create`, client);
  }

  putClient(id: number, client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/update/${id}`, client);
  }

  deleteClient(id: number): Observable<Client> {
    return this.http.delete<Client>(`${this.apiUrl}/delete/${id}`);
  }

}
