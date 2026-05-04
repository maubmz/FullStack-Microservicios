import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { CommonModule } from '@angular/common';
import { Client } from '../../../../shared/interfaces/client.model';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-client-list',
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.css'
})
export class ClientListComponent implements OnInit{
  clients: Client[] = [];
  title: string = "Listado de Clientes";
  listHeaders: string[] = ["Id", "Nombre", "Correo", "Telefono", "Numero de compras", "Editar"];

  constructor(private clientService: ClientService ) {}

  ngOnInit() {
    this.clientService.getAllClient().subscribe({
      next: (clients: Client[]) => {
        this.clients=clients;
      }
    })
  }


}
