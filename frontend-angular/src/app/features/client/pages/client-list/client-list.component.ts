import { Component, OnInit, signal } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { CommonModule } from '@angular/common';
import { Client } from '../../../../shared/interfaces/client.model';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { TableColumn } from '../../../../shared/interfaces/tableColumn.model';

@Component({
  selector: 'app-client-list',
  imports: [
    CommonModule,
    TableComponent
  ],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.css'
})
export class ClientListComponent implements OnInit{
  clients: Client[] = [];
  columnsClients: TableColumn<Client>[] = [
    {key: 'id', label: 'Id'},
    {key: 'name', label: 'Nombre'},
    {key: 'email', label: 'Correo'},
    {key: 'phoneNumber', label: 'Telefono'},
    {key: 'purchases', label: 'Compras', formatter: client => client.purchases.length },
    {key: 'edit', label: 'Editar'}
  ];
  /* Se puede con una señal o enviar una sola variable */
  //title = signal<string>("Listado de Clientes")
  title: string = "Listado de Clientes";

  constructor(private clientService: ClientService ) {}

  ngOnInit() {
    this.clientService.getAllClient().subscribe({
      next: (clients: Client[]) => {
        this.clients=clients;
      }
    })
  }


}
