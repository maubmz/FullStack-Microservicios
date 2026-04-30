import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { CommonModule } from '@angular/common';
import { Client } from '../../../../shared/interfaces/client.model';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-client-list',
  imports: [
    CommonModule,
    NavbarComponent,
    RouterLink
  ],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.css'
})
export class ClientListComponent implements OnInit{
  clients: Client[] = [];
  headersTable: String[] = ["Id", "Nombre", "Correo", "Telefono", "Numero de compras"];

  constructor(private clientService: ClientService ) {}

  ngOnInit() {
    this.clientService.getAllClient().subscribe({
      next: (clients: Client[]): Client[] => (this.clients=clients)
    })
  }


}
