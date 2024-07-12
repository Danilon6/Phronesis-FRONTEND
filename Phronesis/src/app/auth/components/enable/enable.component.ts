import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-enable',
  templateUrl: './enable.component.html',
  styleUrls: ['./enable.component.scss']
})
export class EnableComponent {

  message: string = '';
  isError: boolean = false;
  isReady: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private authSvc: AuthService,
    private router: Router
  ) {}

  redirectToLogin(): void {
    this.router.navigate(['auth/login']);
  }

  ngOnInit() {
    console.log('EnableComponent initialized');

    this.route.queryParams.subscribe(params => {
      const token = params['k'];
      console.log('Token:', token);

      if (token) {
        this.authSvc.enable(token).subscribe({
          next: (response: string) => {
            this.message = response;
            this.isError = false;
            this.isReady = true;
          },
          error: (error: any) => {
            try {
              const parsedError = JSON.parse(error.error);
              if (parsedError && parsedError.message) {
                this.message = parsedError.message;
              } else {
                this.message = 'Si è verificato un errore durante l\'attivazione del tuo account.';
              }
            } catch (e) {
              this.message = error.error || 'Si è verificato un errore durante l\'attivazione del tuo account.';
            }
            this.isError = true;
            this.isReady = true;
          }
        });
      } else {
        this.message = 'Token non valido o mancante.';
        this.isError = true;
        this.isReady = true;
      }
    });
  }
}
