import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-request-new-verification-link',
  templateUrl: './request-new-verification-link.component.html',
  styleUrl: './request-new-verification-link.component.scss'
})
export class RequestNewVerificationLinkComponent {
  message: string = '';
  isError: boolean = false;
  isReady:boolean = false;

  constructor(
    private route: ActivatedRoute,
    private authSvc: AuthService,
    private router: Router
  ) {}

  redirectToLogin(): void {
    this.router.navigate(['/']);
  }

  ngOnInit() {
    console.log('RequestNewVerificationTokenComponent initialized');

    this.route.queryParams.subscribe(params => {
      const email = params['e'];
      console.log('Email:', email);

      if (email) {
        this.authSvc.requestNewVerificationToken(email).subscribe({
          next: (response: string) => {
            console.log('Response:', response);
              this.message = response;
              this.isError = false;
              this.isReady = true;
          },
          error: (error: any) => {
            console.error('Error:', error);
            // Tenta di fare il parsing dell'errore come JSON
            try {
              const parsedError = JSON.parse(error.error);
              if (parsedError && parsedError.message) {
                this.message = parsedError.message;
              } else {
                this.message = 'Si è verificato un errore durante la richiesta del nuovo token.';
              }
            } catch (e) {
              this.message = error.error || 'Si è verificato un errore durante la richiesta del nuovo token.';
            }
            this.isError = true;
            this.isReady = true;
          }
        });
      } else {
        this.message = 'Email non valida o mancante.';
        this.isError = true;
      }
    });
  }
}
