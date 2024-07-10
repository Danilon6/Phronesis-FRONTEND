import { Component } from '@angular/core';
import { ILoginData } from '../../../models/i-login-data';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginUser: ILoginData = {
    username: 'danilo8',
    password: 'password'
  };
  rememberMe: boolean = false;
  errorMessage: string = '';

  constructor(
    private authSvc: AuthService,
    private router: Router
  ) { }

  login() {
    this.authSvc.login(this.loginUser, this.rememberMe).subscribe(() => {
      this.router.navigate(['/feed']);
    });
  }
}
