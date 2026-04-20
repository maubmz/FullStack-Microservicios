import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { CommonModule } from '@angular/common';
import { Client } from '../../../../shared/interfaces/client.model';

@Component({
  selector: 'app-client-list',
  imports: [
    CommonModule
  ],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.css'
})
export class ClientListComponent implements OnInit{
  clients: Client[] = [];

  constructor(private clientService: ClientService ) {}

  ngOnInit() {
    this.clientService.getAllClient().subscribe({
      next: (client) => (this.clients=client)
    })
  }


}
