import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PostService } from '../../../serivces/post.service';
import { AuthService } from '../../../auth/auth.service';
import { IPost } from '../../../models/i-post';
import { IPostRequest } from '../../../models/i-post-request';

@Component({
  selector: 'app-create-post-dialog',
  templateUrl: './create-post-dialog.component.html',
  styleUrl: './create-post-dialog.component.scss'
})
export class CreatePostDialogComponent {
  createPostForm: FormGroup;

  constructor(
    private authSvc:AuthService,
    private postSvc:PostService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreatePostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.createPostForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.createPostForm.valid) {
      const currentUserId = this.authSvc.getCurrentUserId() as number;
      const postRequest: IPostRequest = {
        title: this.createPostForm.get('title')?.value,
        content: this.createPostForm.get('content')?.value,
        userId: currentUserId
      };

      this.postSvc.addPost(postRequest).subscribe(
        (createdPost) => {
          this.dialogRef.close(createdPost);
        }
      );
    }
  }
}
