import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ILike } from '../../../models/i-like';

@Component({
  selector: 'app-like-list-dialog',
  templateUrl: './like-list-dialog.component.html',
  styleUrl: './like-list-dialog.component.scss'
})
export class LikeListDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<LikeListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { likes: ILike[] }
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
