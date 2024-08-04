import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IUser } from '../models/i-user';
import { IRole } from '../models/i-role';
import { NotificationService } from './notification.service';
import { ErrorHandlingServiceService } from './error-handling-service.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userArr:IUser[] = [];
  userSubject = new BehaviorSubject<any[]>([]);
  user$ = this.userSubject.asObservable();
  userUrl: string = environment.usersUrl;

  constructor(private http: HttpClient,
    private errorHandlingSvc: ErrorHandlingServiceService
  ) {
    this.getAllUsers().subscribe(users => {
      this.userArr = users
      this.userSubject.next(this.userArr)
    });
  }

  getAllUsers(): Observable<IUser[]> {
    return this.http.get<{ content: IUser[] }>(this.userUrl).pipe(
      map(response => response.content),
      tap(users => {
        this.userSubject.next(users);
        this.userArr = users;
      })
    );
  }

  getAllBannedUsers(): Observable<IUser[]> {
    return this.http.get<{ content: IUser[] }>(`${this.userUrl}/banned`).pipe(
      map(response => response.content),
      tap(users => {
        this.userSubject.next(users);
        this.userArr = users;
      })
    );
  }

  getUserById(id: number): Observable<IUser> {
    return this.http.get<IUser>(`${this.userUrl}/${id}`).pipe(
      tap(user => {
        const index = this.userArr.findIndex(u => u.id === id);
        if (index !== -1) {
          this.userArr[index] = user;
          this.userSubject.next([...this.userArr]);
        }
      })
    );
  }

  updateUser(id: number, userData: Partial<IUser>): Observable<IUser> {
    return this.http.put<IUser>(`${this.userUrl}/${id}`, userData).pipe(
      tap(updatedUser => {
        const index = this.userArr.findIndex(u => u.id === id);
        if (index !== -1) {
          this.userArr[index] = { ...this.userArr[index], ...updatedUser };
          this.userSubject.next([...this.userArr]);
        }
      })
    );
  }


  addUserRole(id: number, role: string): Observable<IRole> {
    return this.http.patch<IRole>(`${this.userUrl}/${id}/addToRole?role=${role}`, null).pipe(
      tap(updatedUser => {
        const index = this.userArr.findIndex(u => u.id === id);
        if (index !== -1) {
          this.userArr[index] = { ...this.userArr[index], ...updatedUser };
          this.userSubject.next([...this.userArr]);
        }
      }),
      catchError(this.errorHandlingSvc.handleError.bind(this.errorHandlingSvc))
    );
  }

  removeUserRole(id: number, role: string): Observable<IRole> {
    return this.http.patch<IRole>(`${this.userUrl}/${id}/removeToRole?role=${role}`, null).pipe(
      tap(updatedUser => {
        const index = this.userArr.findIndex(u => u.id === id);
        if (index !== -1) {
          this.userArr[index] = { ...this.userArr[index], ...updatedUser };
          this.userSubject.next([...this.userArr]);
        }
      }),
      catchError(this.errorHandlingSvc.handleError.bind(this.errorHandlingSvc))
    );
  }

  deleteUser(id: number): Observable<IUser> {
    return this.http.delete<IUser>(`${this.userUrl}/${id}`).pipe(
      tap(() => {
        this.userArr = this.userArr.filter(u => u.id !== id);
        this.userSubject.next([...this.userArr]);
      })
    );
  }

  updateProfilePicture(id: number, file: File): Observable<IUser> {
    const formData = new FormData();
    formData.append('profilePicture', file);

    return this.http.patch<IUser>(`${this.userUrl}/${id}/profile-picture`, formData).pipe(
      tap(updatedUser => {
        const index = this.userArr.findIndex(u => u.id === id);
        if (index !== -1) {
          this.userArr[index] = { ...this.userArr[index], ...updatedUser };
          this.userSubject.next([...this.userArr]);
        }
      })
    );
  }

  banUser(id: number, reason: string): Observable<string> {
    return this.http.put<string>(`${this.userUrl}/${id}/ban`, reason , {responseType: 'text' as 'json' }).pipe(
      tap(() => {
        const index = this.userArr.findIndex(u => u.id === id);
        if (index !== -1) {
          this.userArr[index].banned = true;
          this.userSubject.next([...this.userArr]);
        }
      })
    );
  }

  unbanUser(id: number): Observable<string> {
    return this.http.put<string>(`${this.userUrl}/${id}/unban`, {}, {responseType: 'text' as 'json' }).pipe(
      tap(() => {
        const index = this.userArr.findIndex(u => u.id === id);
        if (index !== -1) {
          this.userArr[index].banned = false;
          this.userSubject.next([...this.userArr]);
        }
      })
    );
  }

  userHasRole(user: IUser, role: string): boolean {
    return user.roles.some(r => r.roleType === role);
  }
}
