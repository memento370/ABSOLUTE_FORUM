import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Login } from './components/login/login';
import { ModalService } from './service/modal.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: false,
})
export class AppComponent {

  token: string | null = null;
  isAuthenticated = false;

 
  constructor(
    private modalService: ModalService,
    private http: HttpClient,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Тут можна додати логіку перевірки авторизації,
    // наприклад, зчитування з localStorage або сервісу
    this.checkAuthentication();
  }

  checkAuthentication(): void {
    const token = localStorage.getItem('token');
    this.http.post('http://localhost:8080/api/forum/user/check-token',
      token )
   .subscribe({
     next: (valid) => {
      if(valid){
        
      }else{
        //токен не підтверджено,видалити токен
      }

       },
     error: (err) => {
         this.toastr.error(err.error);
     }, 
  });
    }
  

  login(): void {
    // Тимчасова логіка для демонстрації
    this.isAuthenticated = true;
    localStorage.setItem('authToken', 'some-token');
  }

  logout(): void {
    this.isAuthenticated = false;
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
  } 
  openModal() {
    this.modalService.showComponentInModal(Login, { });  }
 
} 
