// login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: false,
})
export class Login {
  isRegister = true;
  email = '';
  login = '';
  nickname = '';
  password = '';
  confirmPassword = '';
  confirmationCode = '';
  emailSent = false;

  sendEmailCode() {
    if (!this.email) {
      alert('Введіть e-mail');
      return;
    }
    this.emailSent = true;
    alert('Код відправлено на e-mail');
  }

  register() {
    if (this.confirmationCode.length === 0) {
      alert('Введіть код підтвердження');
      return;
    }
    alert('Реєстрація успішна!');
  }

  loginUser() {
    alert(`Авторизація для: ${this.login}`);
  }
}
