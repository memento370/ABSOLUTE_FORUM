import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Comment } from '../../../models/comment';
import { User } from '../../../models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../service/AuthService';

@Component({
  selector: 'app-forum-topic-comments',
  templateUrl: './forum-topic-comments.html',
  styleUrls: ['./forum-topic-comments.css'],
  standalone: false
})
export class ForumTopicComments {
  @Input() comment!: Comment;
  @Input() currentUser!: User | null;
  @Output() commentDeleted = new EventEmitter<number>();
  @Output() commentUpdated = new EventEmitter<Comment>();

  editMode = false;
  editText: string = '';

  constructor(private http: HttpClient, private toastr: ToastrService, private auth: AuthService) 
  {}

  onEdit() {
    this.editMode = true;
    this.editText = this.comment.text;
  }

  onCancelEdit() {
    this.editMode = false;
    this.editText = '';
  }

  onSaveEdit() {
    const user = this.auth.getUserFromStorage();
    if (!user) return;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${user.token}`);
    this.http.put<Comment>(
      `http://l2-absolute.com/api/forum/comment-topic/update/${this.comment.id}`,
      { text: this.editText, topicId: this.comment.topicId },
      { headers }
    ).subscribe({
      next: (updated) => {
        this.comment.text = updated.text;
        this.editMode = false;
        this.commentUpdated.emit(updated);
        this.toastr.success('Коментар оновлено!');
      },
      error: (err) => {
        this.toastr.error(err.error,'Помилка!');
      }
    });
  }

  onDelete() {
    if (!confirm('Видалити цей коментар?')) return;
    const user = this.auth.getUserFromStorage();
    if (!user) return;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${user.token}`);

    this.http.delete(
      `http://l2-absolute.com/api/forum/comment-topic/delete/${this.comment.id}`,
      { headers }
    ).subscribe({
      next: () => {
        this.commentDeleted.emit(this.comment.id);
        this.toastr.success('Коментар видалено!');
      },
      error: (err) => {
        this.toastr.error(err.error,'Помилка!');
      }
    });
  }
}
