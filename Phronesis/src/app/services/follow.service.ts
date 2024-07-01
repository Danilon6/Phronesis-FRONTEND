import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IFollowResponse } from '../models/i-follow-response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FollowService {

  private followUrl = environment.followUrl

  constructor(private http: HttpClient) { }

  getFollowers(followingId: number): Observable<IFollowResponse[]> {
    return this.http.get<IFollowResponse[]>(`${this.followUrl}/followers/${followingId}`);
  }

  getFollowing(followerId: number): Observable<IFollowResponse[]> {
    return this.http.get<IFollowResponse[]>(`${this.followUrl}/following/${followerId}`);
  }

  isFollowing(followerId: number, followingId: number): Observable<boolean> {
    const params = new HttpParams()
      .set('followerId', followerId.toString())
      .set('followingId', followingId.toString());
    return this.http.get<boolean>(`${this.followUrl}/is-following`, { params });
  }

  follow(followerId: number, followingId: number): Observable<IFollowResponse> {
    const params = new HttpParams()
      .set('followerId', followerId.toString())
      .set('followingId', followingId.toString());
    return this.http.post<IFollowResponse>(this.followUrl, null, { params });
  }

  unfollow(followerId: number, followingId: number): Observable<IFollowResponse> {
    const params = new HttpParams()
      .set('followerId', followerId.toString())
      .set('followingId', followingId.toString());
    return this.http.delete<IFollowResponse>(this.followUrl, { params });
  }

}
