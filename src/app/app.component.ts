import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Login } from './components/login/login';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { User } from './models/user';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthService } from './service/AuthService';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: false,
})
export class AppComponent {

  bsModalRef!: BsModalRef<Login>;

  token: string | null = null;
  isAuthenticated = false;
    user: User = {
    id: 0,
    status: '',
    title: '',
    login: '',
    password: '',
    nick: '',
    email: '',
    avatar_url: '',
    role:'',
    token:''
  };
  isAuthenticated$!: Observable<boolean>;
  user$!: Observable<User | null>;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private router: Router,
    private auth: AuthService
  ) {
    this.isAuthenticated$ = this.auth.authState$;
    this.user$ = this.auth.userState$;
  }

  ngOnInit(): void {
     // Підписуємося на потік userState$ — синхронізуємо this.user із кожним оновленням
  this.auth.userState$.subscribe(user => {
    if (user) {
      this.user = user;
    } else {
      // якщо розлогінився — очищаємо
      this.user = { id: 0, status: '', title: '', login: '', password: '', nick: '', email: '', avatar_url: '', role:'', token:'' };
    }
  });
  }

  logout(): void {
    this.auth.logout();
    if (this.router.url === '/cabinet') {
     this.router.navigate(['/']);
    }
  }

  openModal(): void {
    this.bsModalRef = this.modalService.show(Login, { initialState: {} });
  }

  goToCabinet(): void {
    this.router.navigate(['/cabinet']);
  }
}
