import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { CommonModule } from '@angular/common';
import { Client } from '../../../../shared/interfaces/client.model';
import { RouterLink } from '@angular/router';

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
  listHeaders: string[] = ["Id", "Nombre", "Correo", "Telefono", "Numero de compras", "Editar", "Eliminar"];

  constructor(private clientService: ClientService ) {}

  ngOnInit() {
    this.clientService.getAllClient().subscribe({
      next: (clients: Client[]): void => {
        this.clients=clients;
      }
    })
  }

  deleteClient(client: Client): void {
    const confirmed: boolean = confirm(
      `Deseas eliminar al cliente "${client.name}" ?`
    );
    if (confirmed && client.idClient) {
      this.clientService.deleteClient(client.idClient)
        .subscribe((): void => {
          window.location.reload();
          this.clientService.getAllClient().subscribe();
        });
    }
  }

}
