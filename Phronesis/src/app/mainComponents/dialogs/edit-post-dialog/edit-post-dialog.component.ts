import { Component, Inject } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IPost } from '../../../models/i-post';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-post-dialog',
  templateUrl: './edit-post-dialog.component.html',
  styleUrls: ['./edit-post-dialog.component.scss'],
  providers: [NgbActiveModal]
})
export class EditPostDialogComponent {
  editedPost: Partial<IPost>;

  constructor(
    public dialogRef: MatDialogRef<EditPostDialogComponent>,
    private modalService: NgbModal,
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
      this.showNotification('Modifica avvenuta con successo');
    } else {
      this.showNotification('Errore: Compila tutti i campi obbligatori.');
    }
  }

  private showNotification(message: string): void {
    // const modalRef = this.modalService.open(EditPostNotificationDialogComponent, { backdrop: false });
    // modalRef.componentInstance.message = message;
  }
}
