import { Injectable } from '@angular/core';
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
}
