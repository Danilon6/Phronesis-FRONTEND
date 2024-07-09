import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { map, tap } from 'rxjs/operators';
import { IUserReportResponse } from '../models/report/i-user-report-response';
import { IUserReportRequest } from '../models/report/i-user-report-request';
import { AuthService } from '../auth/auth.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class UserReportService {

  userReportArr: IUserReportResponse[] = [];

  userReportSubject = new BehaviorSubject<IUserReportResponse[]>([]);

  userReports$ = this.userReportSubject.asObservable();

  userReportUrl: string = environment.userReportUrl;

  constructor(private http: HttpClient, private authSvc: AuthService, private notificationSvc: NotificationService) {
    this.authSvc.isAdmin$.subscribe(isAdmin => {
      if (isAdmin) {
        this.getAllUserReports().subscribe();
      }
    });
  }

  getAllUserReports(): Observable<IUserReportResponse[]> {
    return this.http.get<{ content: IUserReportResponse[] }>(this.userReportUrl).pipe(
      map(response => response.content),
      tap(userReports => {
        this.userReportSubject.next(userReports);
        this.userReportArr = userReports;
      })
    );
  }

  getUserReportById(id: number): Observable<IUserReportResponse> {
    return this.http.get<IUserReportResponse>(`${this.userReportUrl}/${id}`).pipe(
      tap(userReport => {
        const index = this.userReportArr.findIndex(report => report.id === id);
        if (index !== -1) {
          this.userReportArr[index] = userReport;
          this.userReportSubject.next([...this.userReportArr]);
        }
      })
    );
  }

  getAllUserReportsByUserId(id: number): Observable<IUserReportResponse[]> {
    return this.http.get<{ content: IUserReportResponse[] }>(`${this.userReportUrl}/reported-by/${id}`).pipe(
      map(response => response.content),
      tap(userReports => {
        this.userReportSubject.next(userReports);
        this.userReportArr = userReports;
      })
    );
  }

  addUserReport(userReportRequest: IUserReportRequest): Observable<IUserReportResponse> {
    return this.http.post<IUserReportResponse>(this.userReportUrl, userReportRequest).pipe(
      tap(newUserReport => {
        this.userReportArr.push(newUserReport);
        this.userReportSubject.next([...this.userReportArr]);
        this.notificationSvc.notify('Segnalazione utente aggiunta con successo', 'success');
      })
    );
  }

  removeUserReport(id: number): Observable<IUserReportResponse> {
    return this.http.delete<IUserReportResponse>(`${this.userReportUrl}/${id}`).pipe(
      tap(() => {
        this.userReportArr = this.userReportArr.filter(report => report.id !== id);
        this.userReportSubject.next([...this.userReportArr]);
        this.notificationSvc.notify('Segnalazione utente rimossa con successo', 'success');
      })
    );
  }
}
