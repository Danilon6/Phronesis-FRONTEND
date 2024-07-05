import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  isAdmin: boolean = false

  userId!:number

  constructor(
    private authSvc: AuthService
  ) {}

  ngOnInit(): void {
  this.authSvc.isAdmin$.subscribe(isAdmin =>{
    this.isAdmin = isAdmin
  })
  this.userId = this.authSvc.getCurrentUserId() as number
  }

  logout(): void {
    this.authSvc.logout();
  }

}

