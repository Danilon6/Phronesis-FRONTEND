import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IComment } from '../../../models/i-comment';

@Component({
  selector: 'app-edit-comment-dialog',
  templateUrl: './edit-comment-dialog.component.html',
  styleUrl: './edit-comment-dialog.component.scss'
})
export class EditCommentDialogComponent {
    editedContent: string;

    constructor(
      public dialogRef: MatDialogRef<EditCommentDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: { comment: IComment }
    ) {
      this.editedContent = data.comment.content;
    }

    onCancel(): void {
      this.dialogRef.close();
    }

    onSave(): void {
      this.dialogRef.close({ content: this.editedContent });
    }
  }

