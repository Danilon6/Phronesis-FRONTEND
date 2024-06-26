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
type registerData = {
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

    register(newUser:FormData):Observable<registerData>{
      return this.http.post<registerData>(this.registerUrl, newUser)
      .pipe(tap(data => {
        console.log(data.token);

        localStorage.setItem("enablingToken", data.token)
      }))
    }

    enable(token:String):Observable<boolean>{
      return this.http.get<boolean>(`${this.enablingUrl}?token=${token}`)
    }

    login(loginData:ILoginData):Observable<accessData>{
      return this.http.post<accessData>(this.loginUrl, loginData)
      .pipe(tap(data => {
        this.authSubject.next(data.user)
        localStorage.setItem("accessData", JSON.stringify(data))
        this.autologout(data.token)
      }))
    }

    logout():void{
      this.authSubject.next(null)
      localStorage.removeItem("accessData")
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
      const user = localStorage.getItem('accessData')
      if (!user) return

      const accessData:accessData = JSON.parse(user)

      if(this.jwtHelper.isTokenExpired(accessData.token)) return;

      this.authSubject.next(accessData.user)
      this.autologout(accessData.token)
    }

    getAuthToken():string{
      const user = localStorage.getItem('accessData')
      if (!user) return ""

      const accessData:accessData = JSON.parse(user)
      if (this.jwtHelper.isTokenExpired(accessData.token)) return ""

      return accessData.token
    }
  }
