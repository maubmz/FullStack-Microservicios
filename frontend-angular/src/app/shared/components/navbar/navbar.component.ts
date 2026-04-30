import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink, RouterLinkActive} from '@angular/router';

interface NavItem {
  label: string;
  route: string;
}

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  pestanas: NavItem[] = [
    {label: 'Home', route: ''},
    {label: 'client', route: '/client'},
    {label: 'Product', route: '/product'},
    {label: 'Purchase', route: '/purchase'}

  ];

}
