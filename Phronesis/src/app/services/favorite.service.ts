import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IFavorite } from '../models/i-favorite';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { IUserPostInteractionRequest } from '../models/i-user-post-interaction-request';
import { IUserPostInteraction } from '../models/i-user-post-interaction';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  favoriteArr:IFavorite[] = []

  favoriteSubject = new BehaviorSubject<IFavorite[]>([])

  favorite$ = this.favoriteSubject.asObservable()

  favoriteUrl = environment.favoritesUrl

  constructor(private http:HttpClient) { }

  getAllByUserId(userId:number): Observable<IFavorite[]> {
    return this.http.get<{ content: IFavorite[] }>(`${this.favoriteUrl}/user/${userId}`)
    .pipe(
      map(response => response.content),
      tap(favorites =>{
          this.favoriteSubject.next(favorites)
          this.favoriteArr = favorites
      }
      )
    )
  }

  addToFavorite(userPostInteraction:IUserPostInteractionRequest):Observable<Partial<IUserPostInteraction>> {
    return this.http.post<IUserPostInteraction>(`${this.favoriteUrl}`, userPostInteraction);
  }

  removeFromFavorite(id:number):Observable<Partial<IUserPostInteraction>> {
    return this.http.delete<IUserPostInteraction>(`${this.favoriteUrl}/${id}`);
  }

}
