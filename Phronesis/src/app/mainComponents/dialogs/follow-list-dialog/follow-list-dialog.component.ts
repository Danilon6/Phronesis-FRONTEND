import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IFollowResponse } from '../../../models/i-follow-response';

@Component({
  selector: 'app-follow-list-dialog',
  templateUrl: './follow-list-dialog.component.html',
  styleUrl: './follow-list-dialog.component.scss'
})
export class FollowListDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<FollowListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, list: IFollowResponse[], key: 'follower' | 'following' }
  ) {
    console.log('Dialog Data:', data);
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
