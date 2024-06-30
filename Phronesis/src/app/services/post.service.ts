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

  update(postId:number, editedPost:Partial<IPost>):Observable<IPost> {
    return this.http.put<IPost>(`${this.postUrl}/${postId}`,editedPost)
    .pipe(tap((post) =>{
      const index = this.postArr.findIndex(p => p.id == postId)
      if (index !== -1) {
        // Mantieni i commenti e i like esistenti
        const currentPost = this.postArr[index];
        this.postArr[index] = {
          ...currentPost,
          ...post,
          comments: currentPost.comments,
          likes: currentPost.likes
        };
        this.postSubject.next([...this.postArr]);
      }
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
