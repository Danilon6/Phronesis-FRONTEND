import { Injectable } from '@angular/core';
import { IUser } from '../models/i-user';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';
import { ILoginData } from '../models/i-login-data';
import { RoleType } from '../models/role-type';
import { NotificationService } from '../services/notification.service';

type accessData = {
  user:Partial<IUser>
  token:string,
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  jwtHelper: JwtHelperService = new JwtHelperService()

  authSubject = new BehaviorSubject<Partial<IUser> | null>(null)

  isAdmin$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  $user = this.authSubject.asObservable()


  isLoggedIn$ = this.$user.pipe(
    map(user => !!user),
    tap(user =>  this.syncIsLoggedIn = user)
    )

  syncIsLoggedIn: boolean = false

  constructor(
    private http: HttpClient,
    private router: Router,
    private notificationSvc:NotificationService
  ) {
    this.getUserAfterRefresh()
  }

    registerUrl:string = environment.registerUrl
    loginUrl:string = environment.loginUrl
    enablingUrl:string = environment.enablingUrl
    requestNewVerificationUrl:String = environment.requestNewVerificationUrl


    updateAdminStatus(user: Partial<IUser> | null): void {
      if (user?.roles?.some(role => role.roleType === RoleType.ADMIN)) {
        this.isAdmin$.next(true);
      } else {
        this.isAdmin$.next(false);
      }
    }

    register(newUser: FormData): Observable<Partial<IUser>> {
      return this.http.post<Partial<IUser>>(this.registerUrl, newUser)
        .pipe(catchError(this.handleError.bind(this)));
    }

    enable(token:String):Observable<any>{
      return this.http.get<any>(`${this.enablingUrl}?token=${token}`, { responseType: 'text' as 'json' })
    }

    requestNewVerificationToken(email:string):Observable<any> {
      return this.http.get<any>(`${this.requestNewVerificationUrl}?email=${email}`, { responseType: 'text' as 'json' })
    }

    login(loginData: ILoginData, rememberMe: boolean): Observable<accessData | string> {
      return this.http.post<accessData | string>(this.loginUrl, loginData).pipe(
        tap(data => {
          if (typeof data === 'string') {
            // Se la risposta è una stringa, non facciamo nulla nel tap
            return;
          }

          // Se la risposta è di tipo accessData
          this.authSubject.next(data.user);
          this.updateAdminStatus(data.user);
          this.syncIsLoggedIn = true;

          if (rememberMe) {
            localStorage.setItem('accessData', JSON.stringify(data));
          } else {
            sessionStorage.setItem('accessData', JSON.stringify(data));
          }

          this.autologout(data.token);
        }),
        catchError(this.handleError.bind(this))
      );
    }

    logout(){
      this.authSubject.next(null)
      this.updateAdminStatus(null);
      this.syncIsLoggedIn = false;
      localStorage.removeItem("accessData");
      sessionStorage.removeItem('accessData');
      this.router.navigate([""])
    }

    autologout(jwt:string):void{
      const expirationDate = this.jwtHelper.getTokenExpirationDate(jwt) as Date
      const exiprationMs = expirationDate.getTime() - new Date().getTime()

    setTimeout(() => {
      this.logout()
    }, exiprationMs)
    }

    getUserAfterRefresh():void{
      const user = localStorage.getItem('accessData') || sessionStorage.getItem('accessData');
      if (!user) return

      const accessData:accessData = JSON.parse(user)

      if(this.jwtHelper.isTokenExpired(accessData.token)) return;

      this.authSubject.next(accessData.user)
      this.updateAdminStatus(accessData.user);
      this.syncIsLoggedIn = true;
      this.autologout(accessData.token)
    }

    getAuthToken():string{
      const user = localStorage.getItem('accessData') || sessionStorage.getItem('accessData');
      if (!user) return ""

      const accessData:accessData = JSON.parse(user)
      if (this.jwtHelper.isTokenExpired(accessData.token)) return ""

      return accessData.token
    }

    getCurrentUserId(): number | null {
      const currentUser = this.authSubject.value;
      return currentUser?.id ?? null;
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
      let errorMessage = 'Unknown error!';

      if (error.error instanceof ErrorEvent) {
        // Client-side errors
        errorMessage = `Error: ${error.error.message}`;
      } else if (typeof error.error === 'string') {
        // Parse the string error response
        try {
          const parsedError = JSON.parse(error.error);
          errorMessage = parsedError.message || parsedError;
        } catch (e) {
          errorMessage = error.error; // use the string as is if JSON parsing fails
        }
      } else {
        // Server-side errors
        errorMessage = `Error: ${error.error.message}`;
      }

      this.notificationSvc.notify(errorMessage, 'error');
      return throwError(() => new Error(errorMessage));
    }
  }
