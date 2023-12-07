import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/core/services/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MessageService } from 'src/app/services/message/message.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit{
  registerForm!: FormGroup;
  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private fb: FormBuilder, 
    private msgService: MessageService,
) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    })
  }

  register() {
    this.apiService.postAuth('/register', this.registerForm.value).subscribe((res: any) => {
      if(res.success) {
        this.authService.login(res.token, res.data.username)
      } else {
        this.msgService.openSnackBar((!res.error) ? res.message: res.error, 'Close', 'mat-warn');
      }
    })
  }
}
