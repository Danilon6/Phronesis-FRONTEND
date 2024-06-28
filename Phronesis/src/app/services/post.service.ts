import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPost } from '../models/i-post';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { IPostRequest } from '../models/i-post-request';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  postArr:IPost[] = [];

  postSubject = new BehaviorSubject<IPost[]>([])

  post$ = this.postSubject.asObservable()

  constructor(private http:HttpClient) {
    this.getAll().subscribe()
  }

  postUrl:string = environment.postUrl

  getAll(): Observable<IPost[]> {
    return this.http.get<{ content: IPost[] }>(this.postUrl).pipe(
      map(response => response.content),
      tap(posts => {
        this.postSubject.next(posts);
        this.postArr = posts;
      })
    );
  }

  getById(id:number):IPost|null {
    return this.postArr.find(p => p.id == id) || null
  }

  addPost(newPost:IPostRequest):Observable<IPost> {
    return this.http.post<IPost>(this.postUrl, newPost)
    .pipe(tap((createdPost => {
      this.postArr.unshift(createdPost)
      this.postSubject.next(this.postArr)
    }) ))

  }

  update(editedPost:Partial<IPost>):Observable<IPost> {
    return this.http.put<IPost>(`${this.postUrl}/${editedPost.id}`,editedPost)
    .pipe(tap((comment) =>{
      const index = this.postArr.findIndex(c => c.id == editedPost.id)
      this.postArr.splice(index, 1, comment)

      this.postSubject.next(this.postArr)
    }))
  }

  delete(id:number):Observable<IPost> {
    return this.http.delete<IPost>(`${this.postUrl}/${id}`)
    .pipe(tap(() => {
      this.postArr = this.postArr.filter(p => p.id != id)
      this.postSubject.next(this.postArr)
    }))
  }

}
