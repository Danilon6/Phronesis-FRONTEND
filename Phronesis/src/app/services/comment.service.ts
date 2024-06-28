import { IComment } from './../models/i-comment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { ICommentRequest } from '../models/i-comment-request';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  commentArr: IComment[] = [];

  commentSubject = new BehaviorSubject<IComment[]>([])

  comment$ = this.commentSubject.asObservable()

  commentUrl: string = environment.commentsUrl

  constructor(private http: HttpClient) { }

  getAllByPostId(postId: number): Observable<IComment[]> {
    return this.http.get<IComment[]>(`${this.commentUrl}/post/${postId}`)
      .pipe(
        tap(comments => {
          this.commentSubject.next(comments);
          this.commentArr = comments;
        })
      );
  }

  getById(id: number): IComment | null {
    return this.commentArr.find(c => c.id == id) || null;
  }

  addComment(newComment: ICommentRequest): Observable<IComment> {
    return this.http.post<IComment>(this.commentUrl, newComment)
      .pipe(
        tap((createdComment => {
          this.commentArr.unshift(createdComment);
          this.commentSubject.next(this.commentArr);
        }))
      );
  }

  update(editedComment: Partial<IComment>): Observable<IComment> {
    return this.http.patch<IComment>(`${this.commentUrl}/${editedComment.id}`, editedComment)
      .pipe(
        tap((comment) => {
          const index = this.commentArr.findIndex(c => c.id == editedComment.id);
          this.commentArr.splice(index, 1, comment);
          this.commentSubject.next(this.commentArr);
        })
      );
  }

  delete(id: number): Observable<IComment> {
    return this.http.delete<IComment>(`${this.commentUrl}/${id}`)
      .pipe(
        tap(() => {
          this.commentArr = this.commentArr.filter(c => c.id != id);
          this.commentSubject.next(this.commentArr);
        })
      );
  }
}
