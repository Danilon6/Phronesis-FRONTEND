import { Injectable } from '@angular/core';
import { NotificationService } from './notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingServiceService {

  constructor(private notificationSvc: NotificationService) {}

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Errori lato client
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Errori lato server
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (typeof error.error === 'string') {
        console.log(error.error);

        errorMessage = error.error;
      } else if (error.error.message) {
        console.log(error.error.message);
        errorMessage = error.error.message;
      }
    }
    this.notificationSvc.notify(errorMessage, 'error');
    return throwError(() => new Error(errorMessage));
  }
}
