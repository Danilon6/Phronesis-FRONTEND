import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PostService } from '../../../services/post.service';
import { AuthService } from '../../../auth/auth.service';
import { IPost } from '../../../models/i-post';
import { IPostRequest } from '../../../models/i-post-request';

@Component({
  selector: 'app-create-post-dialog',
  templateUrl: './create-post-dialog.component.html',
  styleUrl: './create-post-dialog.component.scss'
})
export class CreatePostDialogComponent {

  newPost: Partial<IPost> = {};

  constructor(
    private dialogRef: MatDialogRef<CreatePostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.newPost.title && this.newPost.content) {
      this.dialogRef.close(this.newPost);
    }
  }
}
