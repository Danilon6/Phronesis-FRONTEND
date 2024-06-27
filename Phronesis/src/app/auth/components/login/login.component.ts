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
    username: '',
    password: ''
  }

  rememberMe: boolean = false;
  errorMessage: string = '';
  constructor(
    private authSvc: AuthService,
    private router: Router
  ) { }

  login() {
    this.authSvc.login(this.loginUser, this.rememberMe)
    .subscribe({
      next: (data) => {
        this.router.navigate(['/home']);
      },
      error: (request) => {
        console.log(request);
        this.errorMessage = request.error.message

      }
    });
  }
}
