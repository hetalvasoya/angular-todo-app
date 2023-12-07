import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  submitted: boolean= false;
  constructor( private fb: FormBuilder) {}

  get f() {
    return this.registerForm.controls;
  }

  ngOnInit () {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })    
  }

  onSubmit() {
    console.log(this.registerForm.value);
    
  }
}
