import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  isLoginForm = true;
  showLoginPassword = false;
  showRegisterPassword = false;

  loginData = {
    email: '',
    password: ''
  };

  registerData = {
    name: '',
    email: '',
    password: ''
  };

  onLoginSubmit(form: any) {
    if (form.valid) {
      console.log('Login Data:', this.loginData);
      // login logic here
    }
  }

  onRegisterSubmit(form: any) {
    if (form.valid) {
      console.log('Registration Data:', this.registerData);
      // registration logic here
    }
  }
  
}
