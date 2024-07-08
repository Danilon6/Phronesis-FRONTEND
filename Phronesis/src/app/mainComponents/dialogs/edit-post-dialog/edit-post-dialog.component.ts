import { Component, Inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IPost } from '../../../models/i-post';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-post-dialog',
  templateUrl: './edit-post-dialog.component.html',
  styleUrls: ['./edit-post-dialog.component.scss'],
  providers: [NgbActiveModal]
})
export class EditPostDialogComponent {
  editedPost: Partial<IPost>;

  constructor(public activeModal: NgbActiveModal, @Inject(MAT_DIALOG_DATA) public data: { post: IPost }) {
    this.editedPost = { ...data.post };
  }

  onCancel(): void {
    this.activeModal.dismiss();
  }

  onSave(): void {
    if (this.editedPost.title && this.editedPost.content) {
      this.activeModal.close(this.editedPost);
    }
  }
}
