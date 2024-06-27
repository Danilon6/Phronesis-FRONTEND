import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-request-new-verification-link',
  templateUrl: './request-new-verification-link.component.html',
  styleUrl: './request-new-verification-link.component.scss'
})
export class RequestNewVerificationLinkComponent {

  constructor(
    private route: ActivatedRoute,
    private authSvc:AuthService,
    private router:Router
  ){
  }


  ngOnInit() {
    this.route.queryParams.subscribe((params: any) => {
      const email = params.e

      this.authSvc.requestNewVerificationToken(email).subscribe(response => {
        this.router.navigate(['/auth/login'])
      })
    })

    }
}
