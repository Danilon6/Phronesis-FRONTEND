import { Injectable } from '@angular/core';
import { IPostReportResponse } from '../models/report/i-post-report-response';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { IPostReportRequest } from '../models/report/i-post-report-request';

@Injectable({
  providedIn: 'root'
})
export class PostReportService {
  postReportArr: IPostReportResponse[] = [];

  postReportSubject = new BehaviorSubject<IPostReportResponse[]>([]);

  postReports$ = this.postReportSubject.asObservable();

  postReportUrl: string = environment.postReportUrl

  constructor(private http: HttpClient) {
    this.getAllpostReports().subscribe();
  }

  getAllpostReports(): Observable<IPostReportResponse[]> {
    return this.http.get<{ content: IPostReportResponse[] }>(this.postReportUrl).pipe(
      map(response => response.content),
      tap(postReports => {
        this.postReportSubject.next(postReports);
        this.postReportArr = postReports;
      })
    );
  }

  getPostReportById(id: number): Observable<IPostReportResponse> {
    return this.http.get<IPostReportResponse>(`${this.postReportUrl}/${id}`).pipe(
      tap(userReport => {
        const index = this.postReportArr.findIndex(report => report.id === id);
        if (index !== -1) {
          this.postReportArr[index] = userReport;
          this.postReportSubject.next([...this.postReportArr]);
        }
      })
    );
  }

  getAllpostReportsByUserId(id: number): Observable<IPostReportResponse[]> {
    return this.http.get<{ content: IPostReportResponse[] }>(`${this.postReportUrl}/reported-by/${id}`).pipe(
      map(response => response.content),
      tap(postReports => {
        this.postReportSubject.next(postReports);
        this.postReportArr = postReports;
      })
    );
  }

  addPostReport(postReportRequest: IPostReportRequest): Observable<IPostReportResponse> {
    return this.http.post<IPostReportResponse>(this.postReportUrl, postReportRequest).pipe(
      tap(newUserReport => {
        this.postReportArr.push(newUserReport);
        this.postReportSubject.next([...this.postReportArr]);
      })
    );
  }

  removePostReport(id: number): Observable<IPostReportResponse> {
    return this.http.delete<IPostReportResponse>(`${this.postReportUrl}/${id}`).pipe(
      tap(() => {
        this.postReportArr = this.postReportArr.filter(report => report.id !== id);
        this.postReportSubject.next([...this.postReportArr]);
      })
    );
  }
}
