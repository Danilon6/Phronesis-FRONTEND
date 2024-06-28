import { Injectable } from '@angular/core';
import { ILike } from '../models/i-like';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { IUserPostInteractionRequest } from '../models/i-user-post-interaction-request';
import { IUserPostInteraction } from '../models/i-user-post-interaction';

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  likeurl:string = environment.likesUrl

  constructor(private http:HttpClient) { }

  getAllLikesByPostId(postId:number):Observable<ILike[]> {
    return this.http.get<ILike[]>(`${this.likeurl}/post/${postId}`);
  }

  addLike(userPostInteraction:IUserPostInteractionRequest):Observable<Partial<IUserPostInteraction>> {
    return this.http.post<Partial<IUserPostInteraction>>(`${this.likeurl}`, userPostInteraction);
  }

  delete(id:number):Observable<Partial<IUserPostInteraction>> {
    return this.http.delete<Partial<IUserPostInteraction>>(`${this.likeurl}/${id}`);
  }
}
