import { Injectable } from '@angular/core';
import { IUser } from '../models/i-user';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';
import { ILoginData } from '../models/i-login-data';

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

  $user = this.authSubject.asObservable()

  isLoggedIn$ = this.$user.pipe(
    map(user => !!user),
    tap(user =>  this.syncIsLoggedIn = user)
    )

  syncIsLoggedIn: boolean = false

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.getUserAfterRefresh()
  }

    registerUrl:string = environment.registerUrl
    loginUrl:string = environment.loginUrl
    enablingUrl:string = environment.enablingUrl
    requestNewVerificationUrl:String = environment.requestNewVerificationUrl

    register(newUser:FormData):Observable<Partial<IUser>>{
      return this.http.post<Partial<IUser>>(this.registerUrl, newUser)
    }

    enable(token:String):Observable<String>{
      return this.http.get<String>(`${this.enablingUrl}?token=${token}`)
    }

    requestNewVerificationToken(email:String):Observable<String> {
      return this.http.get<String>(`${this.requestNewVerificationUrl}?email=${email}`)
    }

    login(loginData:ILoginData, rememberMe:boolean):Observable<accessData>{
      return this.http.post<accessData>(this.loginUrl, loginData)
      .pipe(tap(data => {
        this.authSubject.next(data.user)
        this.syncIsLoggedIn = true;
        if (rememberMe) {
          localStorage.setItem('accessData', JSON.stringify(data));
        } else {
          sessionStorage.setItem('accessData', JSON.stringify(data));
        }
        this.autologout(data.token)
      }))
    }

    logout(){
      this.authSubject.next(null)
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
  }
