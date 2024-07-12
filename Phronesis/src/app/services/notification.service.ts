import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  notify(message: string, type: 'success' | 'error' | 'info', duration: number = 3000) {
    Swal.fire({
      text: message,
      icon: type,
      timer: duration,
      showConfirmButton: false,
      position: 'top-end',
      toast: true,
      timerProgressBar: true
    });
  }

  confirm(message: string): Promise<any> {
    return Swal.fire({
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sì',
      cancelButtonText: 'No'
    });
  }

  notifyValidationErrors(form: NgForm) {
    const errorMessages = {
      required: 'è obbligatorio',
      email: 'non è una email valida'
    };

    Object.keys(form.controls).forEach(key => {
      const controlErrors = form.controls[key].errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach(keyError => {
          let message = '';
          switch (keyError) {
            case 'required':
              message = `${key} è obbligatorio`;
              break;
            case 'email':
              message = `${key} non è una email valida`;
              break;
              message = `${key} non è valido`;
          }
          this.notify(message, 'error');
        });
      }
    });
  }
}
