import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Phronesis';
  constructor(public authSvc: AuthService) {}

  ngOnDestroy(){
    console.log(
      this.authSvc.syncIsLoggedIn

    );

  }
}
