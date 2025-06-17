import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../../models/user'; // Шлях до інтерфейсу User
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../service/AuthService';
import { Router, RouterOutlet } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { take } from 'rxjs';

@Component({
  selector: 'app-cabinet',
  templateUrl: './cabinet.html',
  styleUrls: ['./cabinet.css'],
  standalone: false,
})
export class Cabinet implements OnInit {
  activeTab: string = 'profile';

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

  // --- Аватар ---
  selectedAvatarFile: File | null = null;
  avatarUploadMessage = '';

  // --- Профіль ---
  editNickMode = false;
  editedNick = '';

  editTitleMode = false;
  editedTitle = '';

  message = '';

  editLoginMode = false;
  editedLogin = '';
  isLoginCodeSent = false;
  loginVerificationCode = '';

  editEmailMode = false;
  editedEmail = '';
  isOldEmailCodeSent = false;
  isNewEmailCodeSent = false;
  oldEmailCode = '';
  newEmailCode = '';

  editPasswordMode = false;
  editedPassword = '';
  confirmPassword = '';
  oldPassword = '';
  passwordVerificationCode = '';
  isPasswordCodeSent = false;

  

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    public bsModalRef: BsModalRef ,
    public router : Router,
    private auth: AuthService,

  ) {}

  ngOnInit(): void {
    this.auth.checkAuthentication().subscribe(valid => {
      if (valid) {
        this.loadUser();
      } else {
        this.toastr.error('Необхідно авторизуватися')
        this.router.navigate(['/']);
        this.auth.logout();
      }
    });
  }

  setTab(tab: string) {
    this.activeTab = tab;
    this.message = '';
  }
  

  // ========== AVATAR ==========
  onAvatarSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedAvatarFile = fileInput.files[0];
    } else {
      this.selectedAvatarFile = null;
    }
  }

   uploadAvatar(): void {
    if (!this.selectedAvatarFile) return;

    const token = localStorage.getItem('token');
    if (!token) {
      this.toastr.error('Немає токену');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Image = (reader.result as string).split(',')[1];
      const payload = { base64Image };

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      });

      // Зверніть увагу: видаляємо generic-параметр і явно вказуємо responseType
      this.http
        .post(
          'http://l2-absolute.com/api/forum/user/upload-avatar',
          payload,
          { headers, responseType: 'text' }
        )
        .subscribe({
          next: (url: string) => {
            // 1) Оновлюємо this.user
            this.user.avatar_url = url;
            // 2) Пишемо в localStorage
            localStorage.setItem('avatar_url', url);
            // 3) Оновлюємо BehaviorSubject у AuthService
            const current = this.auth.getUserFromStorage()!;
            const updated: User = { ...current, avatar_url: url };
            this.auth.userState.next(updated);

            this.avatarUploadMessage = 'Аватарку завантажено успішно!';
            this.selectedAvatarFile = null;
            setTimeout(() => this.avatarUploadMessage = '', 3000);
          },
          error: err => {
            this.toastr.error(err.error,"Помилка!")
            this.avatarUploadMessage = err.error;
            setTimeout(() => this.avatarUploadMessage = '', 3000);
          }
        });
    };
    reader.readAsDataURL(this.selectedAvatarFile);
  }

  // ========== PROFILE ==========
  enableEditNick() {
    this.editNickMode = true;
    this.editedNick = this.user.nick;
  }
  cancelEditNick() {
    this.editNickMode = false;
  }

  enableEditTitle() {
    this.editTitleMode = true;
    this.editedTitle = this.user.title;
  }
  cancelEditTitle() {
    this.editTitleMode = false;
  }

  // ========== SECURITY ==========
  enableEditLogin() {
    this.editLoginMode = true;
    this.editedLogin = this.user.login;
  }
  cancelEditLogin() {
    this.editLoginMode = false;
  }
  enableEditEmail() {
    this.editEmailMode = true;
    this.editedEmail = this.user.email;
  }
  cancelEditEmail() {
    this.editEmailMode = false;
  }
  enableEditPassword() {
    this.editPasswordMode = true;
    this.editedPassword = '';
    this.confirmPassword = '';
  }
  cancelEditPassword() {
    this.editPasswordMode = false;
  }
  loadUser() {
    this.http
      .get<User>(
        'http://l2-absolute.com/api/forum/user/get-user/' +
          localStorage.getItem('user_id')
      )
      .subscribe({
        next: (data) => {
          this.user = data;
        },
        error: (err) => {
          this.toastr.error(err.error,"Помилка!")
          this.message = err.error;
        },
      });
  }
  

  deleteAvatar(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.toastr.error('Немає токену');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    // Видаляємо старий аватар
    this.http
      .delete<void>(
        'http://l2-absolute.com/api/forum/user/delete-avatar',
        {
          headers,
          body: { avatar_url: this.user.avatar_url }
        }
      )
      .subscribe({
        next: () => {
          // Оновлюємо localStorage і BehaviorSubject
          localStorage.removeItem('avatar_url');
          this.user.avatar_url = '';
          const current = this.auth.getUserFromStorage()!;
          const updated: User = { ...current, avatar_url: '' };
          this.auth.userState.next(updated);

          this.avatarUploadMessage = 'Аватарку видалено';
          setTimeout(() => this.avatarUploadMessage = '', 3000);
        },
        error: err => {
            this.toastr.error(err.error,"Помилка!")
        }
      });
  }
  saveNick() {
    this.auth.updateProfile(this.editedNick, this.user.title, this.user.status).subscribe({
      next: updatedUser => {
        // Оновлюємо user в компоненті, localStorage і userState сервісу
        this.user.nick = updatedUser.nick;
        localStorage.setItem('nick', updatedUser.nick);
        const current = this.auth.getUserFromStorage()!;
        const updated: User = { ...current, nick: updatedUser.nick };
        this.auth.userState.next(updated);

        this.editNickMode = false;
        this.message = 'Нікнейм оновлено!';
        setTimeout(() => this.message = '', 3000);
      },
      error: err => {
        this.toastr.error(err.error,"Помилка!")
        this.message = err.error;
        setTimeout(() => this.message = '', 3000);
      }
    });
  }
saveTitle() {
  this.auth.updateProfile(this.user.nick, this.editedTitle, this.user.status).subscribe({
    next: updatedUser => {
      this.user.title = updatedUser.title;
      localStorage.setItem('title', updatedUser.title);
      const current = this.auth.getUserFromStorage()!;
      const updated: User = { ...current, title: updatedUser.title };
      this.auth.userState.next(updated);

      this.editTitleMode = false;
      this.message = 'Титул оновлено!';
      setTimeout(() => this.message = '', 3000);
    },
    error: err => {
      this.toastr.error(err.error,"Помилка!")
      this.message = err.error;
      setTimeout(() => this.message = '', 3000);
    }
  });
}

sendLoginVerificationCode() {
  const token = localStorage.getItem('token');
  if (!token) {
    this.toastr.error('Немає токену');
    return;
  }
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  this.http.post(
    'http://l2-absolute.com/api/forum/user/send-verification-login',
    {}, // тіло порожнє, бо e-mail беремо з токену на бекенді
    { headers, responseType: 'text' }
  ).subscribe({
    next: msg => {
      this.toastr.success('Код підтвердження надіслано на e-mail');
      this.isLoginCodeSent = true;
    },
    error: err => {
      this.toastr.error(err.error || 'Не вдалося надіслати код');
    }
  });
}

verifyLoginCodeAndChangeLogin() {
  if (!this.editedLogin) {
    this.toastr.error('Введіть новий логін');
    return;
  }
  if (!this.loginVerificationCode) {
    this.toastr.error('Введіть код підтвердження');
    return;
  }
  const token = localStorage.getItem('token');
  if (!token) {
    this.toastr.error('Немає токену');
    return;
  }
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  const payload = {
    login: this.editedLogin,
    code: this.loginVerificationCode
  };

  this.http.post(
    'http://l2-absolute.com/api/forum/user/change-login',
    payload,
    { headers, responseType: 'text' }
  ).subscribe({
    next: msg => {
      this.toastr.success('Логін змінено');
      this.user.login = this.editedLogin;
      this.editLoginMode = false;
      this.isLoginCodeSent = false;
      this.loginVerificationCode = '';
      // Якщо треба, онови локалсторедж і userState
      localStorage.setItem('login', this.editedLogin);
      const current = this.auth.getUserFromStorage()!;
      const updated: User = { ...current, login: this.editedLogin };
      this.auth.userState.next(updated);
    },
    error: err => {
      this.toastr.error(err.error || 'Не вдалося змінити логін');
    }
  });
}
  sendOldEmailVerificationCode() {
    const token = localStorage.getItem('token');
    if (!token) return;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    this.http.post('http://l2-absolute.com/api/forum/user/send-verification-old-email', {}, { headers, responseType: 'text' })
      .subscribe({
        next: () => {
          this.isOldEmailCodeSent = true;
          this.toastr.success('Код надіслано на старий e-mail');
        },
        error: err => this.toastr.error(err.error || 'Помилка відправки коду')
      });
  }

  sendNewEmailVerificationCode() {
    if (!this.editedEmail) {
      this.toastr.error('Введіть новий e-mail');
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) return;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    this.http.post('http://l2-absolute.com/api/forum/user/send-verification-new-email', { newEmail: this.editedEmail }, { headers, responseType: 'text' })
      .subscribe({
        next: () => {
          this.isNewEmailCodeSent = true;
          this.toastr.success('Код надіслано на новий e-mail');
        },
        error: err => this.toastr.error(err.error || 'Помилка відправки коду')
      });
  }

  changeEmail() {
    if (!this.editedEmail || !this.oldEmailCode || !this.newEmailCode) {
      this.toastr.error('Всі поля обов\'язкові!');
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) return;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    this.http.post(
      'http://l2-absolute.com/api/forum/user/change-email',
      {
        newEmail: this.editedEmail,
        oldEmailCode: this.oldEmailCode,
        newEmailCode: this.newEmailCode
      },
      { headers, responseType: 'text' }
    ).subscribe({
      next: () => {
        this.toastr.success('E-mail змінено!');
        this.user.email = this.editedEmail;
        localStorage.setItem('email', this.editedEmail);
        const current = this.auth.getUserFromStorage()!;
        const updated: User = { ...current, email: this.editedEmail };
        this.auth.userState.next(updated);

        this.editEmailMode = false;
        this.isOldEmailCodeSent = false;
        this.isNewEmailCodeSent = false;
        this.oldEmailCode = '';
        this.newEmailCode = '';
      },
      error: err => this.toastr.error(err.error || 'Не вдалося змінити e-mail')
    });
  }
  sendPasswordVerificationCode() {
    const token = localStorage.getItem('token');
    if (!token) return;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    this.http.post('http://l2-absolute.com/api/forum/user/send-verification-password', {}, { headers, responseType: 'text' })
      .subscribe({
        next: () => {
          this.isPasswordCodeSent = true;
          this.toastr.success('Код надіслано на e-mail');
        },
        error: err => this.toastr.error(err.error || 'Помилка відправки коду')
      });
  }

  savePasswordCabinet() {
    if (!this.oldPassword || !this.editedPassword || !this.confirmPassword || !this.passwordVerificationCode) {
      this.message = 'Заповніть всі поля!';
      setTimeout(() => this.message = '', 3000);
      return;
    }
    if (this.editedPassword !== this.confirmPassword) {
      this.message = 'Паролі не збігаються.';
      setTimeout(() => this.message = '', 3000);
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) return;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const payload = {
      oldPassword: this.oldPassword,
      newPassword: this.editedPassword,
      code: this.passwordVerificationCode
    };
    this.http.post(
      'http://l2-absolute.com/api/forum/user/change-password',
      payload,
      { headers, responseType: 'text' }
    ).subscribe({
      next: () => {
        this.toastr.success('Пароль змінено!');
        this.editPasswordMode = false;
        this.isPasswordCodeSent = false;
        this.oldPassword = '';
        this.editedPassword = '';
        this.confirmPassword = '';
        this.passwordVerificationCode = '';
      },
      error: err => {
        this.message = err.error || 'Не вдалося змінити пароль';
        setTimeout(() => this.message = '', 3000);
      }
    });
  }


}
