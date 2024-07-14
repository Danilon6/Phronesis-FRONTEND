import { environment } from './../../environments/environment.development';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAdvert } from '../models/i-advert';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { NotificationService } from './notification.service';
import { ErrorHandlingServiceService } from './error-handling-service.service';
import { IAdvertRequest } from '../models/i-advert-request';

@Injectable({
  providedIn: 'root'
})
export class AdsService {


  advertArr: IAdvert[] = [];
  advertSubject = new BehaviorSubject<IAdvert[]>([]);
  advert$ = this.advertSubject.asObservable();
  advertsUrl: string = environment.advertUrl;

  constructor(private http: HttpClient,
    private notificationSvc:NotificationService,
    private errorHandlingSvc: ErrorHandlingServiceService
  ) {
    this.getAdverts().subscribe();
  }

  getAdverts(): Observable<IAdvert[]> {
    return this.http.get<{ content: IAdvert[] }>(this.advertsUrl).pipe(
      map(response => response.content),
      tap(adverts => {
        this.advertArr = adverts;
        this.advertSubject.next(adverts);
      })
    );
  }

  getAdvert(id: number): Observable<IAdvert> {
    return this.http.get<IAdvert>(`${this.advertsUrl}/${id}`).pipe(
      tap(advert => {
        const index = this.advertArr.findIndex(a => a.id === id);
        if (index !== -1) {
          this.advertArr[index] = advert;
          this.advertSubject.next([...this.advertArr]);
        }
      })
    );
  }

  createAdvert(newAdvert: IAdvertRequest, image: File): Observable<IAdvert> {
    const formData = new FormData();
    formData.append('advert', new Blob([JSON.stringify(newAdvert)], { type: 'application/json' }));
    if (image) {
      formData.append('advertImage', image);
    }
    return this.http.post<IAdvert>(this.advertsUrl, formData).pipe(
      tap(advert => {
        this.advertArr.push(advert);
        this.advertSubject.next([...this.advertArr]);
      }),
      catchError(this.errorHandlingSvc.handleError.bind(this.errorHandlingSvc))
    );
  }

  updateAdvert(id: number, newAdvert: Partial<IAdvert>, image: File): Observable<IAdvert> {
    const formData = new FormData();
    formData.append('advert', new Blob([JSON.stringify(newAdvert)], { type: 'application/json' }));
    if (image) {
      formData.append('advertImage', image);
    }
    return this.http.put<IAdvert>(`${this.advertsUrl}/${id}`, formData).pipe(
      tap(updatedAdvert => {
        const index = this.advertArr.findIndex(a => a.id === id);
        if (index !== -1) {
          this.advertArr[index] = updatedAdvert;
          this.advertSubject.next([...this.advertArr]);
        }
      })
    );
  }

  deleteAdvert(id: number): Observable<void> {
    return this.http.delete<void>(`${this.advertsUrl}/${id}`).pipe(
      tap(() => {
        this.advertArr = this.advertArr.filter(a => a.id !== id);
        this.advertSubject.next([...this.advertArr]);
      })
    );
  }

  updateAdvertImage(id: number, image: File): Observable<IAdvert> {
    const formData = new FormData();
    formData.append('advertImage', image);
    return this.http.patch<IAdvert>(`${this.advertsUrl}/${id}/image`, formData).pipe(
      tap(updatedAdvert => {
        const index = this.advertArr.findIndex(a => a.id === id);
        if (index !== -1) {
          this.advertArr[index] = updatedAdvert;
          this.advertSubject.next([...this.advertArr]);
        }
      })
    );
  }

}
