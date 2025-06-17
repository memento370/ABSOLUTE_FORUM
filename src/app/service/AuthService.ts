// auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap, catchError, interval, switchMap, startWith, EMPTY } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../models/user';
import { LoginResponse } from '../models/login-response';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public authState = new BehaviorSubject<boolean>(this.hasValidToken());
  authState$ = this.authState.asObservable();

  public userState = new BehaviorSubject<User | null>(this.getUserFromStorage());
  userState$ = this.userState.asObservable();

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router
  ) {
    // одразу й по інтервалу перевіряємо токен
    interval(300_000 /* 5 хв */)
      .pipe(
        // перевірити одразу при запуску:
        startWith(0),
        // для кожного «тику» викликати checkAuthentication()
        switchMap(() => this.checkAuthentication())
      )
      .subscribe(valid => {
        // якщо змінився стан — BehaviorSubject оновиться
        this.authState.next(valid);
      });
  }

  login(res: LoginResponse): void {
    localStorage.setItem('token',       res.token);
    localStorage.setItem('status',      res.status);
    localStorage.setItem('nick',        res.nick);
    localStorage.setItem('title',       res.title);
    localStorage.setItem('user_id',     res.user_id);
    localStorage.setItem('avatar_url',  res.avatar_url);
    localStorage.setItem('role',        res.role);
    localStorage.setItem('loginTime',   Date.now().toString());

    this.userState.next(this.getUserFromStorage());
    this.authState.next(true);
  }

  logout(): void {
    localStorage.clear();
    this.userState.next(null); 
    this.authState.next(false);
    this.router.navigate(['/']);
  }

  private hasValidToken(): boolean {
    return !!localStorage.getItem('token');
  }

  public getUserFromStorage(): User | null {
    const nick = localStorage.getItem('nick');
    if (!nick) return null;
    return {
      id: +(localStorage.getItem('user_id') ?? 0),
      status:     localStorage.getItem('status')     ?? '',
      title:      localStorage.getItem('title')      ?? '',
      login:      '',
      password:   '',
      nick,
      email:      '',
      avatar_url: localStorage.getItem('avatar_url') ?? '',
      role : localStorage.getItem('role') ?? '',
      token : localStorage.getItem('token')?? '',
    };
  }

  /** Повертає Observable<boolean>, але сам по собі не оновлює BehaviorSubject */
  checkAuthentication(): Observable<boolean> {
    const token = localStorage.getItem('token');
    const user = this.getUserFromStorage();
    if (!token) {
        return of(false);
    }
    if(!user){
        return of(false);
    }
    return this.http
      .post<boolean>('http://l2-absolute.com/api/forum/user/check-user-token',user)
      .pipe(
        tap(valid => {
          if (!valid) {
            this.logout(); 
            if (this.router.url === '/cabinet') {
                this.router.navigate(['/']);
            }
            this.toastr.error(
              'Час авторизації вийшов, авторизуйтесь заново!',
              'Прострочена авторизація'
            );
          }
        }),
        catchError(err => {
          this.toastr.error(err.error || 'Помилка перевірки токена');
          return of(false);
        })
      );
  }
  updateProfile(nick: string, title: string, status: string): Observable<User> {
    const token = localStorage.getItem('token');
    if (!token) {
      return EMPTY; // <-- замість undefined
    }

    const payload = { nick, title, status };
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    return this.http.post<User>(
      'http://l2-absolute.com/api/forum/user/update-profile',
      payload,
      { headers }
    );
  }

  
}
