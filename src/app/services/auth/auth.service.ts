import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {  
  constructor(private router: Router) {  }

  hasAccess() {
    const token = localStorage.getItem('token');
    if(token) {      
      return true;
    }
    return false;
  }

  login(token: string, username: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    this.router.navigate(['/todo'])
  }

  logOut() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}
