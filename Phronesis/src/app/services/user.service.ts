import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../models/i-user';
import { IRole } from '../models/i-role';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userArr:IUser[] = [];
  userSubject = new BehaviorSubject<any[]>([]);
  user$ = this.userSubject.asObservable();
  userUrl: string = environment.usersUrl;

  constructor(private http: HttpClient) {
    this.getAllUsers().subscribe();
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
      })
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
      })
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

  banUser(id: number, reason: string): Observable<IUser> {
    return this.http.put<IUser>(`${this.userUrl}/${id}/ban`, { reason }).pipe(
      tap(() => {
        const index = this.userArr.findIndex(u => u.id === id);
        if (index !== -1) {
          this.userArr[index].banned = true;
          this.userSubject.next([...this.userArr]);
        }
      })
    );
  }

  unbanUser(id: number): Observable<IUser> {
    return this.http.put<IUser>(`${this.userUrl}/${id}/unban`, {}).pipe(
      tap(() => {
        const index = this.userArr.findIndex(u => u.id === id);
        if (index !== -1) {
          this.userArr[index].banned = false;
          this.userSubject.next([...this.userArr]);
        }
      })
    );
  }
}
