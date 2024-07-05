import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Phronesis';
  isAdmin:boolean = false
  constructor(public authSvc: AuthService) {}

  ngOnInit(){
    console.log(this.isAdmin);

    this.authSvc.isAdmin$.subscribe( isAdmin=>{
      this.isAdmin = isAdmin
    })
    console.log(this.isAdmin);

  }
  ngOnDestroy(){
  }
}
