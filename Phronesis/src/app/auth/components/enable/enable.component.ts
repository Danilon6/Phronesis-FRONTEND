import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-enable',
  templateUrl: './enable.component.html',
  styleUrl: './enable.component.scss'
})
export class EnableComponent {

  constructor(
    private authSvc:AuthService,
    private router:Router
  ){
  }

  token:String | null = localStorage.getItem("enablingToken")

  ngOnInit() {
    if (this.token) {
      this.authSvc.enable(this.token).subscribe(response => {
        this.router.navigate(['/auth/login'])
      } )
    }

  }
}
