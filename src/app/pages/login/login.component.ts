import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MessageService } from 'src/app/services/message/message.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private fb: FormBuilder, 
    private router: Router,
    private msgService: MessageService) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required,  Validators.minLength(8)]]
    })
  }

  login() {
    this.apiService.postAuth('/login', this.loginForm.value)
    .subscribe((res: any) => {
      if(res.success) {
        this.authService.login(res.token, res.data.username);
      } else {
        console.log(res.message);
        this.msgService.openSnackBar((!res.error) ? res.message: res.error, 'Close', 'mat-warn');
      }
    })
  }
}
