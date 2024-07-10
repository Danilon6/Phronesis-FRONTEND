import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IAdvert } from '../../../models/i-advert';

@Component({
  selector: 'app-create-edit-advert-dialog',
  templateUrl: './create-edit-advert-dialog.component.html',
  styleUrls: ['./create-edit-advert-dialog.component.scss']
})
export class CreateEditAdvertDialogComponent {

  newAdvert: Partial<IAdvert> = {};
  imageFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    public dialogRef: MatDialogRef<CreateEditAdvertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { advert?: IAdvert } | null
  ) {}

  ngOnInit(): void {
    if (this.data && this.data.advert) {
      this.newAdvert = { ...this.data.advert };
      if (this.newAdvert.imageUrl) {
        this.imagePreview = this.newAdvert.imageUrl;
      }
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.imageFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.imageFile);
    }
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('file') as HTMLInputElement;
    fileInput.click();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.dialogRef.close({ newAdvert: this.newAdvert, imageFile: this.imageFile });
  }
}
