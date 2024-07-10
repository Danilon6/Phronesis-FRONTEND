import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-update-profile-picture',
  templateUrl: './update-profile-picture.component.html',
  styleUrl: './update-profile-picture.component.scss'
})
export class UpdateProfilePictureComponent {
  selectedFile: File | null = null;
  selectedFileUrl: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<UpdateProfilePictureComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { currentImage: string, title: string }
  ) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = e => this.selectedFileUrl = (e.target as FileReader).result as string;
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
