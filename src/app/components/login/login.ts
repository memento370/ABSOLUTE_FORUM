// login.component.ts
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { switchMap } from 'rxjs';
import { LoginResponse } from '../../models/login-response';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: false,
})
export class Login {

  statusTab = 'register';
  email = '';
  login = '';
  nick = '';
  password = '';
  confirmPassword = '';
  confirmationCode = '';
  isCodeSent: boolean = false;
  registerSuccess : boolean = false;
  verificationCode: string = '';
  autentification: boolean = false;

  statusRestorePassword:string = 'default'
  isCodeSentRestore:boolean = false;
  isCodeSentRestoreApply:boolean = false;
  isPassChangeSuccses:boolean = false;
  codeRestorePass:string=''
  newPassword:string=''
  confirmNewPassword:string=''

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
) {}
  sendVerificationCode() {
    if(this.confirmPassword==null||undefined||''){
      this.toastr.error("Подтвердите пароль", "Ошибка");
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.toastr.error("Пароли не совпадают", "Ошибка");
      return;
    }

      const account = {
          email: this.email,
          login: this.login,
          nick: this.nick,
          password: this.password,
          confirmPassword: this.confirmPassword
      };
      this.http.post('http://localhost:8080/api/forum/user/check-register', account, { responseType: 'text' })
          .pipe(
              switchMap(() =>
                  this.http.post('http://localhost:8080/api/forum/user/send-verification',{email: account.email},{ responseType: 'text' })
              )
          )
          .subscribe({
              next: () => {
                  this.toastr.success('Код подтверждения регистрации отправлен на ваш e-mail. Проверьте ваш почтовый ящик и введите его в поле ниже для подтверждения регистрации');
                  this.isCodeSent = true;
              },
              error: (err) => {
                  this.toastr.error(err.error || 'Произошла ошибка', 'Ошибка');
                  this.registerSuccess = false;
              }
          });
  }
    verifyCode() {
      this.http
      .post('http://localhost:8080/api/forum/user/verify-code', {
          email: this.email,
          code: this.verificationCode,
      },{ responseType: 'text' })
      .subscribe({
          next: () => {
              this.toastr.success('Код регистрации подтвержден');
          this.register();
          },
          error: (err) => {
              this.toastr.error(err.error);
              this.isCodeSent = false;
              this.registerSuccess = false;
          },
      });
  }

  register() {
    // if (this.confirmationCode.length === 0) {
    //   alert('тут зробити апі запит на реєсрацію');
    //   return;
    // }
    // alert('Реєстрація успішна!');

    this.http
    .post('http://localhost:8080/api/forum/user/create-user', {
        email: this.email,
        login: this.login,
        password:this.password,
        nick:this.nick
    },{ responseType: 'text' })
    .subscribe({
        next: () => {
            this.toastr.success('Регистрация успешна');
        // this.register();
        },
        error: (err) => {
            this.toastr.error(err.error);
            this.isCodeSent = false;
            this.registerSuccess = false;
        },
    });
  }

  loginUser() {
    const account = {
      login: this.login,
      password: this.password
    };
  
    this.http.post<LoginResponse>('http://localhost:8080/api/forum/user/login', account)
      .subscribe({
        next: (res: LoginResponse) => {
          this.toastr.success(res.message, "Успех");
          localStorage.setItem('token', res.token);
          localStorage.setItem('status', res.status);
          localStorage.setItem('nick', res.nick);
          localStorage.setItem('title', res.title);
          localStorage.setItem('loginTime', Date.now().toString());
          // document.cookie = `token=${res.token}; max-age=3600; path=/; Secure; SameSite=Strict`;
          this.autentification = true;
          setTimeout(() => {
            // this.onGetCharacters();
          }, 1000);
        },
        error: (err) => {
          this.toastr.error(err.error, "Ошибка");
        }
      });
  }

  sendCodeRestore(){
    this.http.post('http://localhost:8080/api/forum/user/send-verification-restore', {email: this.email}, { responseType: 'text' })
    .subscribe({
      next: () => {
          this.toastr.success('Код підтвердження скидання паролю відправлено на ваш е-мейл , введіть його в поле нижче');
          this.statusRestorePassword = 'codeSentRestore';
        },
      error: (err) => {
          this.toastr.error(err.error);
          this.statusRestorePassword = 'default';
      },
  });
  }

  approweCodeRestore(){
    this.http.post('http://localhost:8080/api/forum/user/verify-code-restore',
       {
        email: this.email,
        code: this.codeRestorePass,
      }, { responseType: 'text' })
    .subscribe({
      next: () => {
          this.toastr.success('Cкидання паролю підтверджено');
          this.statusRestorePassword = 'codeSentRestoreApply';

        },
      error: (err) => {
          this.toastr.error(err.error);
          this.statusRestorePassword = 'default';

      },
  });

  } 
  changePassword(){
    this.http.post('http://localhost:8080/api/forum/user/restore-password',
      {
       email: this.email,
       pass: this.newPassword,
     }, { responseType: 'text' })
   .subscribe({
     next: () => {
         this.toastr.success('Встановлено новий пароль. Авторизуйтесь!');
         this.statusRestorePassword = 'passwordRestoreSuccses';

       },
     error: (err) => {
         this.toastr.error(err.error);
         this.statusRestorePassword = 'default';

     },
  });
  }
  }

