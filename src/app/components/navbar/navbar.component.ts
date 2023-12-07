import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  username: string |null = localStorage.getItem('username');
  constructor(private authService: AuthService) {}
  logout() {
    this.authService.logOut();
  }
}
