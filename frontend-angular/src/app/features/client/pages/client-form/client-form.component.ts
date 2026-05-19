import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {Client} from '../../../../shared/interfaces/client.model';
import {ClientService} from '../../services/client.service';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-client-form',
  imports: [
    CommonModule,
    RouterLink,
    FormsModule
  ],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.css'
})
export class ClientFormComponent implements OnInit {
  client: Client = {
    name: '',
    email: '',
    phone: '',
    purchases: []
  };

  constructor(private route: ActivatedRoute,
              private clientService: ClientService,
              private router: Router,

  ) {}

  ngOnInit() {
    const userId: string | null = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.client.idClient = +userId;
      this.getInfoClient(this.client.idClient);
    }
  }

  getInfoClient(id: number): void {
    if (this.client.idClient) {
      this.clientService.getClientById(id).subscribe(client => {
        this.client = client;
      });
    }
  };

  saveClient(): void {
    if(this.client.idClient) {
      console.log("Actualizacion de cliente");
      this.clientService.putClient(this.client.idClient, this.client)
        .subscribe(() => this.router.navigate(['clients']));
    } else {
      console.log("Creacion de cliente");
      this.clientService.postClient(this.client)
        .subscribe(() => this.router.navigate(['clients']));
    }
  }

}
