import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IUser } from '../../../models/i-user';

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrl: './edit-user-dialog.component.scss'
})
export class EditUserDialogComponent {
  editedUser: Partial<IUser>;

  constructor(
    public dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: IUser }
  ) {
    this.editedUser = { ...data.user };
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.editedUser.firstName && this.editedUser.lastName && this.editedUser.email && this.editedUser.bio) {
      this.dialogRef.close(this.editedUser);
    }
  }
}
