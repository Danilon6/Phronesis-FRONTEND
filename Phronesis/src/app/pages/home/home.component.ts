import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { ILoginData } from '../../models/i-login-data';
import { NotificationService } from '../../services/notification.service';
import { ErrorHandlingServiceService } from '../../services/error-handling-service.service';
import { IUser } from '../../models/i-user';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  loginUser: ILoginData = {
    username: 'Admin',
    password: 'password'
  };
  rememberMe: boolean = false;
  errorMessage: string = '';
  showPassword:boolean = false

  constructor(
    private authSvc: AuthService,
    private router: Router,
    private notificationSvc: NotificationService,
    private errorHandlingSvc: ErrorHandlingServiceService
  ) { }

  login() {
    this.authSvc.login(this.loginUser, this.rememberMe).subscribe(() => {
      this.router.navigate(['/feed']);
    });
  }

  newUser: Partial<IUser> = {};
  file: File | undefined;
  profileImageUrl: string | ArrayBuffer | null = "https://res.cloudinary.com/ddcghtsnn/image/upload/v1719225290/aavszufvpxsxdrqiyn8s.png";

  register(registerForm: NgForm) {
    const formData = new FormData();
    formData.append('newUser', new Blob([JSON.stringify(this.newUser)], { type: 'application/json' }));
    if (this.file) {
      formData.append('profilePictureFile', this.file);
    }

    this.authSvc.register(formData).subscribe(() => {
        this.router.navigate(['/']);
        this.notificationSvc.notify('Registrazione avvenuta con successo', 'success');
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

  @ViewChild('container') container!: ElementRef;

  signIn() {
    this.container.nativeElement.classList.remove('right-panel-active');
  }

  signUp() {
    this.container.nativeElement.classList.add('right-panel-active');
  }
}
