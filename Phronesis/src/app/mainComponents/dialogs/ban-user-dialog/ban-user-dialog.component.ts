import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-ban-user-dialog',
  templateUrl: './ban-user-dialog.component.html',
  styleUrl: './ban-user-dialog.component.scss'
})
export class BanUserDialogComponent {
  reason: string = '';

  constructor(public dialogRef: MatDialogRef<BanUserDialogComponent>) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.dialogRef.close(this.reason);
  }
}
