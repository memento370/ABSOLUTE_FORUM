import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../service/AuthService';
import { ToastrService } from 'ngx-toastr';

import { Comment } from '../../models/comment';
import { Topic } from '../../models/topic';
import { User } from '../../models/user';
import { switchMap } from 'rxjs';
import { Section, SECTIONS, Subsection } from '../../constants/ForumSections';

@Component({
  selector: 'app-forum-topic',
  templateUrl: './forum-topic.html',
  styleUrls: ['./forum-topic.css'],
  standalone: false,
})
export class ForumTopic implements OnInit {
  @Output() commentDeleted = new EventEmitter<number>();
  @Output() commentUpdated = new EventEmitter<Comment>();

  isCreateMode = false;
  topicId: string = '';
  topic: Topic | null = null; // Для перегляду і для comments
  newTopic: Topic = this.initNewTopic(); // Для створення

  currentUser: User | null = null;
  newComment: string = '';

  selectedSection: string = '';
  sections: Section[] = SECTIONS;

  author: User | undefined 

  editMode = false; // Для відображення редактора

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    const nav = this.router.getCurrentNavigation();
    const subSection = nav?.extras.state?.['subSection'];
    if (subSection) {
      this.setSectionAndSubsection(subSection);
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.topicId = params.get('id') || '';
      this.auth.userState$.subscribe(user => this.currentUser = user);

      // 1. Перевіряємо наявність "edit" в url:
      this.editMode = this.router.url.endsWith('/edit');

      if (this.topicId === 'create') {
        this.isCreateMode = true;
        const user = this.auth.getUserFromStorage();
        if (user) {
          this.currentUser = user;
          this.newTopic.createdBy = user;
        } else {
          this.toastr.error('Авторизуйтесь що б створити тему!','Помилка!')
          this.router.navigate(['/']);
        }
      } else {
        this.isCreateMode = false;
        this.loadTopic();
      }
    });
  }



  private initNewTopic(): Topic {
    return {
      id: 0,
      status: 'ACTIVE',
      createdBy: {} as User, // об'єкт User, ініціалізується при створенні
      creationDate: new Date(),
      title: '',
      message: '',
      subSection: '',
      comments: []
    };
  }

  getSubsectionsForSelectedSection(): Subsection[] {
    const section = this.sections.find(s => s.name === this.selectedSection);
    return section ? section.subsections : [];
  }

  onSectionChange() {
    this.newTopic.subSection = '';
  }


    loadTopic(): void {
      this.http.get<Topic>(`http://l2-absolute.com/api/forum/topic/${this.topicId}`).subscribe({
        next: topic => {
          this.topic = topic;
          if (this.topic) {
            this.loadAuthor();
            this.loadComments(this.topic.id);
          }
        },
        error: () => {
          this.toastr.error('Не вдалося завантажити тему.');
          this.router.navigate(['/']);
        }
      });
    }

    loadComments(topicId: number): void {
      this.http.get<Comment[]>(`http://l2-absolute.com/api/forum/comment-topic/${topicId}`).subscribe({
        next: comments => {
          if (this.topic) {
            this.topic.comments = comments;
          }
        },
        error: () => {
          this.toastr.error('Не вдалося завантажити коментарі.');
        }
      });
    }
  loadAuthor() {
    this.http
      .get<User>(
        'http://l2-absolute.com/api/forum/user/get-user/' +
          this.topic?.createdBy
      )
      .subscribe({
        next: (data) => {
          this.author = data;
        },
        error: (err) => {
          this.toastr.error(err.error);
        },
      });
  }


  saveTopic(): void {
    const user = this.auth.getUserFromStorage();
    if (!user) {
      this.toastr.error('Необхідна авторизація!');
      return;
    }
    if (!this.newTopic.title.trim() || !this.newTopic.message.trim()) {
      this.toastr.error('Заповніть всі поля!');
      return;
    }
    if (!this.newTopic.subSection) {
      this.toastr.error('Оберіть підсекцію!');
      return;
    }
    // Записати автора
    this.newTopic.createdBy = user;

    const payload = {
      subSection: this.newTopic.subSection,
      title: this.newTopic.title,
      message: this.newTopic.message
    };

    const headers = new HttpHeaders().set('Authorization', `Bearer ${user.token}`);
    this.http.post<Topic>(`http://l2-absolute.com/api/forum/topic/create`, payload, { headers }).subscribe({
      next: topic => {
        this.toastr.success('Тему створено!');
        this.router.navigate(['topic-type', this.newTopic.subSection, 'topic', topic.id]);
      },
      error: () => {
        this.toastr.error('Не вдалося створити тему!');
      }
    });
  }

    addComment(): void {
      const user = this.auth.getUserFromStorage();
      if (!user || !this.topic) {
        this.toastr.error('Авторизуйтесь для коментування');
        return;
      }
      if (!this.newComment.trim()) return;

      const payload = {
        text: this.newComment,
        topicId: this.topic.id
      };
      const headers = new HttpHeaders().set('Authorization', `Bearer ${user.token}`);
      this.http.post<Comment>(
        `http://l2-absolute.com/api/forum/comment-topic/create`, 
        payload, 
        { headers }
      ).subscribe({
        next: c => {
          this.topic?.comments.push(c);
          this.newComment = '';
          this.toastr.success('Коментар додано!');
        },
        error: (err) => {
          this.toastr.error(err.error,'Помилка!');
        }
      });
    }

  private setSectionAndSubsection(subSection: string) {
    // Знайти секцію, в якій є потрібна підсекція
    for (const section of this.sections) {
      const match = section.subsections.find(sub => sub.link === subSection);
      if (match) {
        this.selectedSection = section.name;
        this.newTopic.subSection = subSection;
        break;
      }
    }
  }
  onCommentDeleted() {
    if (this.topic) {
      this.loadComments(this.topic.id);
    }
  }
  onCommentUpdated(updated: Comment) {
    if (this.topic) {
      this.loadComments(this.topic.id);
    }
  }
  getSubsectionName(subSectionKey: string | undefined): string {
    if (!subSectionKey) return '';
    for (const section of SECTIONS) {
      const sub = section.subsections.find(s => s.link === subSectionKey);
      if (sub) return sub.name;
    }
    return subSectionKey;
  }
    
  isTopicAuthor(): boolean {
    if (!this.currentUser || !this.topic || !this.topic.createdBy) return false;
    const topicAuthorId = typeof this.topic.createdBy === 'object'
      ? this.topic.createdBy.id
      : this.topic.createdBy;
    return this.currentUser.id === topicAuthorId;
  }

  goToEditMode() {
    if (!this.topic) return;
    const type = this.topic.subSection;
    this.router.navigate([`/topic-type`, type, 'topic', this.topic.id, 'edit']);
  }
  cancelEdit() {
    if (!this.topic) return;
    const type = this.topic.subSection;
    this.router.navigate(['/topic-type', type, 'topic', this.topic.id]);
  }

  saveTopicEdit() {
    if (!this.topic) return;
    const user = this.auth.getUserFromStorage();
    if (!user) {
      this.toastr.error('Необхідна авторизація!');
      return;
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${user.token}`);

    const payload = {
      title: this.topic.title,
      message: this.topic.message,
      subSection: this.topic.subSection,
    };
    this.http.put<Topic>(`http://l2-absolute.com/api/forum/topic/update/${this.topic.id}`, payload, { headers })
      .subscribe({
        next: (updated) => {
          this.toastr.success('Тему оновлено!');
          this.topic = updated;
          this.editMode = false;
        },
        error: (err) => {
          this.toastr.error(err.error,'Помилка!');
        }
      });
  }

  deleteTopic() {
    if (!this.topic) return;
    if (!confirm('Видалити цю тему?')) return;

    const user = this.auth.getUserFromStorage();
    if (!user) {
      this.toastr.error('Необхідна авторизація!');
      return;
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${user.token}`);
    this.http.delete(`http://l2-absolute.com/api/forum/topic/delete/${this.topic.id}`, { headers })
      .subscribe({
        next: () => {
          this.toastr.success('Тему видалено!');
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.toastr.error(err.error,'Помилка!');
        }
      });
  }

}
