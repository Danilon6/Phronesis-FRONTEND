import { Component } from '@angular/core';
import { IUser } from '../../../models/i-user';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { NotificationService } from '../../../services/notification.service';
import { ErrorHandlingServiceService } from '../../../services/error-handling-service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  newUser: Partial<IUser> = {};
  file: File | undefined;
  profileImageUrl: string | ArrayBuffer | null = "https://res.cloudinary.com/ddcghtsnn/image/upload/v1719225290/aavszufvpxsxdrqiyn8s.png";
  errorMessage: string = '';
  showPassword: boolean = false;

  constructor(
    private authSvc: AuthService,
    private router: Router,
    private notificationSvc: NotificationService,
    private errorHandlingSvc: ErrorHandlingServiceService
  ) {}

  register(registerForm: NgForm) {
    if (registerForm.invalid) {
      this.notificationSvc.notifyValidationErrors(registerForm);
      return;
    }

    const formData = new FormData();
    formData.append('newUser', new Blob([JSON.stringify(this.newUser)], { type: 'application/json' }));
    if (this.file) {
      formData.append('profilePictureFile', this.file);
    }

    this.authSvc.register(formData).subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
        this.notificationSvc.notify('Registrazione avvenuta con successo', 'success');
      },
      error: (error) => this.errorHandlingSvc.handleError(error)
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.file = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImageUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }
}
