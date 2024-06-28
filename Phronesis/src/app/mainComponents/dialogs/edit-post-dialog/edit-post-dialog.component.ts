import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IPost } from '../../../models/i-post';

@Component({
  selector: 'app-edit-post-dialog',
  templateUrl: './edit-post-dialog.component.html',
  styleUrl: './edit-post-dialog.component.scss'
})
export class EditPostDialogComponent {
  editedPost: Partial<IPost>;

  constructor(
    public dialogRef: MatDialogRef<EditPostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { post: IPost }
  ) {
    this.editedPost = { ...data.post };
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.editedPost.title && this.editedPost.content) {
      this.dialogRef.close(this.editedPost);
    }
  }
}
