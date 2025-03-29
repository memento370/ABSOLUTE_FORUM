import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Login } from './components/login/login';
import { ModalService } from './components/service/modal.service';
import { ModalComponent } from './components/service/modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: false,
})
export class AppComponent {
  isAuthenticated: boolean = false; // Стан авторизації
  username: string = ''; // Ім'я користувача (буде видно після авторизації)

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    // Тут можна додати логіку перевірки авторизації,
    // наприклад, зчитування з localStorage або сервісу
    this.checkAuthentication();
  }

  checkAuthentication(): void {
    // Тимчасова логіка для прикладу
    // У реальному проекті це може бути перевірка токена
    const token = localStorage.getItem('authToken');
    if (token) {
      this.isAuthenticated = true;
      this.username = localStorage.getItem('username') || 'User';
    }
  }

  login(): void {
    // Тимчасова логіка для демонстрації
    this.isAuthenticated = true;
    this.username = 'TestUser';
    localStorage.setItem('authToken', 'some-token');
    localStorage.setItem('username', this.username);
  }

  logout(): void {
    this.isAuthenticated = false;
    this.username = '';
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
  }
  openModal() {
    this.modalService.open(Login);
  }
 
}
