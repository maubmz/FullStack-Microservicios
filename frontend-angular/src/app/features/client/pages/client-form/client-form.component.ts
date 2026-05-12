import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Client} from '../../../../shared/interfaces/client.model';
import {ClientService} from '../../services/client.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-client-form',
  imports: [
    CommonModule
  ],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.css'
})
export class ClientFormComponent implements OnInit {
  userId: string | null= '';
  client: Client = {
    idClient: 0,
    name: '',
    email: '',
    phone: '',
    purchases: []
  };

  constructor(private route: ActivatedRoute, private clientService: ClientService) {}

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.getInfoClient(+this.userId);
    }
  }

  getInfoClient(id: number): void {
    if (this.userId) {
      this.clientService.getClientById(id).subscribe(client => {
        this.client = client;
      });
    }
  };


}
